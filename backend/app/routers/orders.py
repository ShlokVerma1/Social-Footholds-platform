from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from datetime import datetime, timezone

from app.core import supabase
from app.models import Order, OrderCreate, User, PriceCalculation
from app.auth import get_current_user, get_admin_user
from app.routers.services import calculate_price

router = APIRouter()

@router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate, current_user: User = Depends(get_current_user)):
    """Creates a new content creator order based on the service selected."""
    svc_result = supabase.table('services').select('*').eq('id', order_data.service_id).single().execute()
    if not svc_result.data:
        raise HTTPException(status_code=404, detail="Service not found")

    service = svc_result.data

    # Reuse the pricing logic from services router
    calc_result = await calculate_price(PriceCalculation(
        service_id=order_data.service_id,
        details=order_data.details
    ))

    order_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    order_doc = {
        "id": order_id,
        "user_id": current_user.id,
        "service_id": order_data.service_id,
        "service_name": service["name"],
        "details": order_data.details,
        "amount": calc_result["amount"],
        "status": "pending",
        "payment_status": "pending",
        "created_at": now,
    }

    supabase.table('orders').insert(order_doc).execute()
    return order_doc

@router.get("/orders", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_user)):
    """Fetch orders contextually (all for admin, personal for creator)."""
    if current_user.role == "admin":
        result = supabase.table('orders').select('*').order('created_at', desc=True).execute()
    else:
        result = supabase.table('orders').select('*').eq('user_id', current_user.id).order('created_at', desc=True).execute()
    return result.data

@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: User = Depends(get_current_user)):
    """Fetch a single order, enforcing ownership."""
    result = supabase.table('orders').select('*').eq('id', order_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")

    # Verify authorization
    if current_user.role != "admin" and result.data["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return result.data

@router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, admin: User = Depends(get_admin_user)):
    """Admin-only: Progress order states (processing -> completed)."""
    result = supabase.table('orders').update({"status": status}).eq('id', order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated"}
