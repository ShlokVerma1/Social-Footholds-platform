from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from datetime import datetime, timezone

from app.core import supabase
from app.models import Enquiry, EnquiryCreate, User
from app.auth import get_admin_user

router = APIRouter()

@router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(enquiry_data: EnquiryCreate):
    """Allows anonymous site visitors to submit a contact form ticket."""
    enquiry_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    enquiry_doc = {
        "id": enquiry_id,
        "name": enquiry_data.name,
        "email": enquiry_data.email,
        "message": enquiry_data.message,
        "service": enquiry_data.service,
        "channel_link": enquiry_data.channel_link,
        "status": "new",
        "created_at": now,
    }

    supabase.table('enquiries').insert(enquiry_doc).execute()
    return enquiry_doc

@router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries(admin: User = Depends(get_admin_user)):
    """Admin-only: Pull all contact form history."""
    result = supabase.table('enquiries').select('*').order('created_at', desc=True).execute()
    return result.data

@router.put("/enquiries/{enquiry_id}/status")
async def update_enquiry_status(enquiry_id: str, status: str, admin: User = Depends(get_admin_user)):
    """Admin-only: Mark enquiries as closed/contacted."""
    result = supabase.table('enquiries').update({"status": status}).eq('id', enquiry_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Status updated"}
