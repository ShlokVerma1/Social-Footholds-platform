import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabaseServer'

export async function GET(request) {
  try {
    const { supabase, user } = await authenticate()

    const { data, error } = await supabase
      .from('orders')
      .select('id, payment_status, status, service_name, amount, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error
    if (!data || data.length === 0) {
      return NextResponse.json({ status: "no_orders", message: "No orders found" })
    }

    const latest = data[0]
    return NextResponse.json({
        order_id: latest.id,
        payment_status: latest.payment_status,
        order_status: latest.status,
        service_name: latest.service_name,
        amount: latest.amount,
    })
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
