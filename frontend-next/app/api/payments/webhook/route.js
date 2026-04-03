import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseServer'
import Stripe from 'stripe'

export async function POST(request) {
  try {
    const payload = await request.text() // raw body string
    const signature = request.headers.get('stripe-signature')

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !stripeWebhookSecret) {
        return NextResponse.json({ error: 'Stripe is not fully configured' }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecretKey)

    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret)
    } catch (err) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const order_id = session.metadata?.order_id
      if (order_id) {
        await supabase.from('orders').update({
          payment_status: "paid",
          status: "processing",
        }).eq('id', order_id)
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const session = event.data.object
      const order_id = session.metadata?.order_id
      if (order_id) {
        await supabase.from('orders').update({
          payment_status: "failed",
        }).eq('id', order_id)
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
