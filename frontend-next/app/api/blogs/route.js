import { NextResponse } from 'next/server'
import { authenticateAdmin, createClient } from '@/lib/supabaseServer'

export async function GET(request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get('published_only') !== 'false'

    let query = supabase.from('blogs').select('*')
    
    if (publishedOnly) {
      query = query.eq('published', true)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { supabase, user } = await authenticateAdmin()
    const body = await request.json()

    // Get author name from profile
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
    const authorName = profile?.name || 'Admin'

    const now = new Date().toISOString()
    const blogDoc = {
      id: crypto.randomUUID(),
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || null,
      author: authorName,
      published: body.published || false,
      created_at: now,
      updated_at: now,
    }

    const { error } = await supabase.from('blogs').insert(blogDoc)
    if (error) throw error

    return NextResponse.json(blogDoc)
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
