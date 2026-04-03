import { NextResponse } from 'next/server'
import { authenticateAdmin, createClient } from '@/lib/supabaseServer'

export async function GET(request, { params }) {
  try {
    const supabase = await createClient()

    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 })

    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { supabase } = await authenticateAdmin()
    const body = await request.json()
    
    const updateData = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      published: body.published,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Blog not found' }, { status: 404 })

    return NextResponse.json(data)
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { supabase } = await authenticateAdmin()

    const { data, error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', params.id)
      .select()
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 means zero rows returned
    
    // We actually just care that it doesn't fail, supabase delete returning data is optional
    return NextResponse.json({ message: 'Blog deleted' })
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
