import { NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/supabaseServer'

export async function PUT(request, { params }) {
  try {
    const { supabase } = await authenticateAdmin()
    
    // Get status from search params as implemented in the frontend api client
    // api.put(`/orders/${id}/status`, null, { params: { status } })
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    return NextResponse.json({ message: "Status updated" })
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
