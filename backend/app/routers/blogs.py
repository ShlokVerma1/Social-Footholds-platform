from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from datetime import datetime, timezone

from app.core import supabase
from app.models import Blog, BlogCreate, User
from app.auth import get_admin_user

router = APIRouter()

@router.get("/blogs", response_model=List[Blog])
async def get_blogs(published_only: bool = True):
    """Fetch blog posts globally. Can list drafts if not restricted to published."""
    query = supabase.table('blogs').select('*')
    if published_only:
        query = query.eq('published', True)
    result = query.order('created_at', desc=True).execute()
    return result.data

@router.get("/blogs/{blog_id}", response_model=Blog)
async def get_blog(blog_id: str):
    """Fetch specific blog details for reader."""
    result = supabase.table('blogs').select('*').eq('id', blog_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Blog not found")
    return result.data

@router.post("/blogs", response_model=Blog)
async def create_blog(blog_data: BlogCreate, admin: User = Depends(get_admin_user)):
    """Admin-only: Publish a new blog post."""
    blog_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    blog_doc = {
        "id": blog_id,
        "title": blog_data.title,
        "content": blog_data.content,
        "excerpt": blog_data.excerpt,
        "author": admin.name,
        "published": blog_data.published,
        "created_at": now,
        "updated_at": now,
    }

    supabase.table('blogs').insert(blog_doc).execute()
    return blog_doc

@router.put("/blogs/{blog_id}", response_model=Blog)
async def update_blog(blog_id: str, blog_data: BlogCreate, admin: User = Depends(get_admin_user)):
    """Admin-only: Update blog post content or toggle published state."""
    now = datetime.now(timezone.utc).isoformat()

    update_data = {
        "title": blog_data.title,
        "content": blog_data.content,
        "excerpt": blog_data.excerpt,
        "published": blog_data.published,
        "updated_at": now,
    }

    result = supabase.table('blogs').update(update_data).eq('id', blog_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Blog not found")

    updated = supabase.table('blogs').select('*').eq('id', blog_id).single().execute()
    return updated.data

@router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, admin: User = Depends(get_admin_user)):
    """Admin-only: Permanently delete a blog post."""
    result = supabase.table('blogs').delete().eq('id', blog_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted"}
