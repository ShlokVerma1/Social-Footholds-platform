from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import stripe
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Environment Variables
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Initialize clients only if credentials exist
supabase: Client = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase: {e}")

# Stripe
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= MODELS =============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str = "creator"

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    pricing_type: str  # per_view, subscription, per_project, package
    base_price: float
    features: List[str]
    icon: str = ""

class OrderCreate(BaseModel):
    service_id: str
    details: dict  # Service-specific details

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    service_id: str
    service_name: str
    details: dict
    amount: float
    status: str = "pending"  # pending, processing, completed, cancelled
    payment_status: str = "pending"  # pending, paid, failed
    stripe_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    service: Optional[str] = None
    channel_link: Optional[str] = None

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    service: Optional[str] = None
    channel_link: Optional[str] = None
    status: str = "new"  # new, contacted, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    published: bool = False

class Blog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: Optional[str] = None
    author: str
    published: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PriceCalculation(BaseModel):
    service_id: str
    details: dict  # e.g., {"views": 10000} or {"duration": 6}

class CheckoutSessionRequest(BaseModel):
    order_id: str

# ============= HELPER FUNCTIONS =============

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Verify Supabase JWT and return user profile."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        token = credentials.credentials
        user_response = supabase.auth.get_user(token)
        user_data = user_response.user
        if not user_data:
            raise credentials_exception

        # Fetch profile from profiles table
        profile = supabase.table('profiles').select('*').eq('id', str(user_data.id)).single().execute()
        if not profile.data:
            raise credentials_exception

        return User(
            id=str(user_data.id),
            email=user_data.email,
            name=profile.data.get('name', ''),
            role=profile.data.get('role', 'creator'),
        )
    except HTTPException:
        raise
    except Exception:
        raise credentials_exception

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ============= SERVICE ROUTES =============

@api_router.get("/services", response_model=List[Service])
async def get_services():
    result = supabase.table('services').select('*').execute()
    return result.data

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    result = supabase.table('services').select('*').eq('id', service_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Service not found")
    return result.data

@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_data: Service, admin: User = Depends(get_admin_user)):
    update_data = service_data.model_dump()
    # Remove fields that shouldn't be updated
    update_data.pop('created_at', None)
    supabase.table('services').update(update_data).eq('id', service_id).execute()
    # Fetch updated record
    result = supabase.table('services').select('*').eq('id', service_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Service not found")
    return result.data

# ============= PRICING ROUTES =============

@api_router.post("/pricing/calculate")
async def calculate_price(calc: PriceCalculation):
    result = supabase.table('services').select('*').eq('id', calc.service_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Service not found")

    service = result.data
    amount = 0.0

    if service["pricing_type"] == "per_view":
        # Video promotion: base_price per 1000 views
        views = calc.details.get("views", 0)
        amount = (views / 1000) * service["base_price"]

    elif service["pricing_type"] == "subscription":
        # Channel SEO: base_price per month
        duration = calc.details.get("duration", 1)  # in months
        amount = service["base_price"] * duration

    elif service["pricing_type"] == "per_project":
        # Fixed price services
        quantity = calc.details.get("quantity", 1)
        amount = service["base_price"] * quantity

    elif service["pricing_type"] == "package":
        # Package pricing (e.g., shorts)
        quantity = calc.details.get("quantity", 1)
        amount = service["base_price"] * quantity

    return {"amount": round(amount, 2), "currency": "USD"}

# ============= ORDER ROUTES =============

@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate, current_user: User = Depends(get_current_user)):
    # Get service
    svc_result = supabase.table('services').select('*').eq('id', order_data.service_id).single().execute()
    if not svc_result.data:
        raise HTTPException(status_code=404, detail="Service not found")

    service = svc_result.data

    # Calculate amount
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

@api_router.get("/orders", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_user)):
    if current_user.role == "admin":
        result = supabase.table('orders').select('*').order('created_at', desc=True).execute()
    else:
        result = supabase.table('orders').select('*').eq('user_id', current_user.id).order('created_at', desc=True).execute()
    return result.data

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: User = Depends(get_current_user)):
    result = supabase.table('orders').select('*').eq('id', order_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check ownership
    if current_user.role != "admin" and result.data["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return result.data

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, admin: User = Depends(get_admin_user)):
    result = supabase.table('orders').update({"status": status}).eq('id', order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated"}

# ============= PAYMENT ROUTES =============

@api_router.post("/payments/create-checkout-session")
async def create_checkout_session(req: CheckoutSessionRequest, current_user: User = Depends(get_current_user)):
    """Create a Stripe Checkout session for an order."""
    order_result = supabase.table('orders').select('*').eq('id', req.order_id).single().execute()
    if not order_result.data:
        raise HTTPException(status_code=404, detail="Order not found")

    order = order_result.data

    # Check ownership
    if current_user.role != "admin" and order["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Don't allow double payment
    if order.get("payment_status") == "paid":
        raise HTTPException(status_code=400, detail="Order already paid")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": order["service_name"],
                        "description": f"Order #{order['id'][:8]}",
                    },
                    "unit_amount": int(order["amount"] * 100),  # Convert to cents
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/payment/{req.order_id}",
            metadata={
                "order_id": req.order_id,
                "user_id": current_user.id,
            },
        )

        # Save stripe session ID to order
        supabase.table('orders').update({
            "stripe_session_id": session.id
        }).eq('id', req.order_id).execute()

        return {"url": session.url}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/payments/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session.get("metadata", {}).get("order_id")
        if order_id:
            supabase.table('orders').update({
                "payment_status": "paid",
                "status": "processing",
            }).eq('id', order_id).execute()

    elif event["type"] == "customer.subscription.deleted":
        session = event["data"]["object"]
        order_id = session.get("metadata", {}).get("order_id")
        if order_id:
            supabase.table('orders').update({
                "payment_status": "failed",
            }).eq('id', order_id).execute()

    return {"status": "ok"}

@api_router.get("/payments/subscription-status")
async def get_subscription_status(current_user: User = Depends(get_current_user)):
    """Get latest payment status for the current user."""
    result = supabase.table('orders').select('id, payment_status, status, service_name, amount, created_at') \
        .eq('user_id', current_user.id) \
        .order('created_at', desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        return {"status": "no_orders", "message": "No orders found"}

    latest = result.data[0]
    return {
        "order_id": latest["id"],
        "payment_status": latest["payment_status"],
        "order_status": latest["status"],
        "service_name": latest["service_name"],
        "amount": latest["amount"],
    }

# ============= ENQUIRY ROUTES =============

@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(enquiry_data: EnquiryCreate):
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

@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries(admin: User = Depends(get_admin_user)):
    result = supabase.table('enquiries').select('*').order('created_at', desc=True).execute()
    return result.data

@api_router.put("/enquiries/{enquiry_id}/status")
async def update_enquiry_status(enquiry_id: str, status: str, admin: User = Depends(get_admin_user)):
    result = supabase.table('enquiries').update({"status": status}).eq('id', enquiry_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Status updated"}

# ============= BLOG ROUTES =============

@api_router.get("/blogs", response_model=List[Blog])
async def get_blogs(published_only: bool = True):
    query = supabase.table('blogs').select('*')
    if published_only:
        query = query.eq('published', True)
    result = query.order('created_at', desc=True).execute()
    return result.data

@api_router.get("/blogs/{blog_id}", response_model=Blog)
async def get_blog(blog_id: str):
    result = supabase.table('blogs').select('*').eq('id', blog_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Blog not found")
    return result.data

@api_router.post("/blogs", response_model=Blog)
async def create_blog(blog_data: BlogCreate, admin: User = Depends(get_admin_user)):
    blog_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    blog_doc = {
        "id": blog_id,
        "title": blog_data.title,
        "content": blog_data.content,
        "excerpt": blog_data.excerpt,
        "author": admin.name,
        "published": blog_data.published,
        "created_at": now,
        "updated_at": now,
    }

    supabase.table('blogs').insert(blog_doc).execute()
    return blog_doc

@api_router.put("/blogs/{blog_id}", response_model=Blog)
async def update_blog(blog_id: str, blog_data: BlogCreate, admin: User = Depends(get_admin_user)):
    now = datetime.now(timezone.utc).isoformat()

    update_data = {
        "title": blog_data.title,
        "content": blog_data.content,
        "excerpt": blog_data.excerpt,
        "published": blog_data.published,
        "updated_at": now,
    }

    result = supabase.table('blogs').update(update_data).eq('id', blog_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Fetch updated record
    updated = supabase.table('blogs').select('*').eq('id', blog_id).single().execute()
    return updated.data

@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, admin: User = Depends(get_admin_user)):
    result = supabase.table('blogs').delete().eq('id', blog_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted"}

# ============= ADMIN ROUTES =============

@api_router.get("/admin/dashboard")
async def get_admin_dashboard(admin: User = Depends(get_admin_user)):
    # Get stats
    users_result = supabase.table('profiles').select('id').eq('role', 'creator').execute()
    total_users = len(users_result.data)

    orders_result = supabase.table('orders').select('id').execute()
    total_orders = len(orders_result.data)

    enquiries_result = supabase.table('enquiries').select('id').eq('status', 'new').execute()
    pending_enquiries = len(enquiries_result.data)

    # Recent registrations (last 7 days) — approximate via profiles
    from datetime import timedelta
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    recent_result = supabase.table('profiles').select('id').eq('role', 'creator') \
        .gte('created_at', seven_days_ago).execute()
    recent_users = len(recent_result.data)

    # Revenue
    paid_orders = supabase.table('orders').select('amount').eq('payment_status', 'paid').execute()
    total_revenue = sum(order["amount"] for order in paid_orders.data)

    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "pending_enquiries": pending_enquiries,
        "recent_registrations": recent_users,
        "total_revenue": round(total_revenue, 2),
    }

@api_router.get("/admin/users")
async def get_all_users(admin: User = Depends(get_admin_user)):
    result = supabase.table('profiles').select('*').eq('role', 'creator') \
        .order('created_at', desc=True).execute()
    return result.data

# ============= ROOT & HEALTH =============

@api_router.get("/")
async def root():
    return {"message": "Social Footholds API v1.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
