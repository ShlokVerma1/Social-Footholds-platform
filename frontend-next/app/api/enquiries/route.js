import { NextResponse } from 'next/server'
import { authenticateAdmin, createClient } from '@/lib/supabaseServer'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const enquiryDoc = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      message: body.message,
      service: body.service || null,
      channel_link: body.channel_link || null,
      status: "new",
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('enquiries').insert(enquiryDoc)
    if (error) throw error

    return NextResponse.json(enquiryDoc)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { supabase } = await authenticateAdmin()

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
