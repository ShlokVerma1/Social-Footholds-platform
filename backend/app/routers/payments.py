from fastapi import APIRouter, HTTPException, Depends, Request
import stripe
from app.core import supabase, STRIPE_WEBHOOK_SECRET, FRONTEND_URL
from app.models import User, CheckoutSessionRequest
from app.auth import get_current_user

router = APIRouter()

@router.post("/payments/create-checkout-session")
async def create_checkout_session(req: CheckoutSessionRequest, current_user: User = Depends(get_current_user)):
    """Creates a generic Stripe Checkout session dynamically hooked to an order ID."""
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

@router.post("/payments/webhook")
async def stripe_webhook(request: Request):
    """Listens for Stripe webhooks and instantly fires database updates on completion."""
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

@router.get("/payments/subscription-status")
async def get_subscription_status(current_user: User = Depends(get_current_user)):
    """Fetch the latest active payment cycle for the current creator."""
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
