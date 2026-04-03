import { NextResponse } from 'next/server'
import { authenticateAdmin, createClient } from '@/lib/supabaseServer'

export async function GET(request, { params }) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
      
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { supabase } = await authenticateAdmin()
    const body = await request.json()
    
    // Remove fields that shouldn't be updated
    delete body.created_at
    
    const { data, error } = await supabase
      .from('services')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
      
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    return NextResponse.json(data)
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
