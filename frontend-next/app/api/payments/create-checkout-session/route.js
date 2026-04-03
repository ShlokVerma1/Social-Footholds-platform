import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabaseServer'
import Stripe from 'stripe'

export async function POST(request) {
  try {
    const { supabase, user } = await authenticate()
    const { order_id } = await request.json()

    if (!order_id) {
        return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (error) throw error
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Check ownership
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (order.user_id !== user.id && (!profile || profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
        return NextResponse.json({ error: 'Stripe is fully not configured yet' }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecretKey)

    // Using absolute URL based on the request
    const origin = request.headers.get('origin') || process.env.FRONTEND_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: order.service_name,
              description: `Order #${order.id.substring(0, 8)}`,
            },
            unit_amount: Math.round(order.amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/${order_id}`,
      metadata: {
        order_id: order_id,
        user_id: user.id,
      },
    })

    // Save stripe session ID to order
    await supabase.from('orders').update({
        stripe_session_id: session.id
    }).eq('id', order_id)

    return NextResponse.json({ url: session.url })

  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
