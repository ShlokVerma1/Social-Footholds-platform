import { NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/supabaseServer'

export async function GET(request) {
  try {
    const { supabase } = await authenticateAdmin()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'creator')
        .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
