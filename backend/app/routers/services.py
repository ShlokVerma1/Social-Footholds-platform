from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.core import supabase
from app.models import Service, User, PriceCalculation
from app.auth import get_admin_user

router = APIRouter()

@router.get("/services", response_model=List[Service])
async def get_services():
    """Retrieve all available services."""
    result = supabase.table('services').select('*').execute()
    return result.data

@router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Retrieve a specific service by ID."""
    result = supabase.table('services').select('*').eq('id', service_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Service not found")
    return result.data

@router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_data: Service, admin: User = Depends(get_admin_user)):
    """Admin-only: Update service details."""
    update_data = service_data.model_dump()
    update_data.pop('created_at', None)  # Prevent overriding creation timestamp
    supabase.table('services').update(update_data).eq('id', service_id).execute()
    
    result = supabase.table('services').select('*').eq('id', service_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Service not found")
    return result.data

@router.post("/pricing/calculate")
async def calculate_price(calc: PriceCalculation):
    """Calculate the final price for a service dynamically based on its pricing tiers."""
    result = supabase.table('services').select('*').eq('id', calc.service_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Service not found")

    service = result.data
    amount = 0.0

    if service["pricing_type"] == "per_view":
        views = calc.details.get("views", 0)
        amount = (views / 1000) * service["base_price"]
    elif service["pricing_type"] == "subscription":
        duration = calc.details.get("duration", 1)  # in months
        amount = service["base_price"] * duration
    elif service["pricing_type"] == "per_project":
        quantity = calc.details.get("quantity", 1)
        amount = service["base_price"] * quantity
    elif service["pricing_type"] == "package":
        quantity = calc.details.get("quantity", 1)
        amount = service["base_price"] * quantity

    return {"amount": round(amount, 2), "currency": "USD"}
