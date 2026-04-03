import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('services').select('*')
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
