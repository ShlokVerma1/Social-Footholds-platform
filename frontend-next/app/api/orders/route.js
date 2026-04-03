import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabaseServer'
import { calculatePriceAmount } from '@/lib/pricingCalc'

export async function POST(request) {
  try {
    const { supabase, user } = await authenticate()
    const { service_id, details } = await request.json()

    if (!service_id || !details) {
      return NextResponse.json({ error: 'Missing service_id or details' }, { status: 400 })
    }

    // Get service to verify and get name/pricing
    const { data: service, error: svcError } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single()

    if (svcError) throw svcError
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    const amount = calculatePriceAmount(service, details)
    const order_id = crypto.randomUUID()

    const orderDoc = {
      id: order_id,
      user_id: user.id,
      service_id,
      service_name: service.name,
      details,
      amount,
      status: "pending",
      payment_status: "pending",
      created_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase.from('orders').insert(orderDoc)
    if (insertError) throw insertError

    return NextResponse.json(orderDoc)
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}

export async function GET(request) {
  try {
    const { supabase, user } = await authenticate()

    // Determine role without throwing using single check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

    if (!profile || profile.role !== 'admin') {
      // Normal user: only see own orders
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
