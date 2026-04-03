import { NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/supabaseServer'

export async function PUT(request, { params }) {
  try {
    const { supabase } = await authenticateAdmin()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    if (!enquiry) return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })

    return NextResponse.json({ message: "Status updated" })
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
