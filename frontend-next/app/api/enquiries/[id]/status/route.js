import { NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/supabaseServer'

export async function PUT(request, { params }) {
  try {
    const { supabase } = await authenticateAdmin()
    
    const body = await request.json().catch(() => ({}));
    const { searchParams } = new URL(request.url)
    
    const status = body.status || searchParams.get('status')
    const priority = body.priority || searchParams.get('priority')

    if (!status && !priority) {
      return NextResponse.json({ error: 'Status or Priority is required' }, { status: 400 })
    }

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;

    if (status === 'responded') {
      updates.admin_responded_at = new Date().toISOString();
    }

    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    if (!enquiry) return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })

    return NextResponse.json({ message: "Enquiry updated", enquiry })
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
