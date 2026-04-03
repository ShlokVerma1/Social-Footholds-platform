import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabaseServer'

export async function GET(request, { params }) {
  try {
    const { supabase, user } = await authenticate()

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
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

    return NextResponse.json(order)
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
