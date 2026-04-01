'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { blogAPI } from '@/lib/api';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', published: false });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAll(false);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) { await blogAPI.update(editingBlog.id, formData); }
      else { await blogAPI.create(formData); }
      setFormData({ title: '', excerpt: '', content: '', published: false });
      setShowForm(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) { console.error('Error saving blog:', error); alert('Failed to save blog'); }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({ title: blog.title, excerpt: blog.excerpt || '', content: blog.content, published: blog.published });
    setShowForm(true);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try { await blogAPI.delete(blogId); fetchBlogs(); }
    catch (error) { console.error('Error deleting blog:', error); alert('Failed to delete blog'); }
  };

  const handleCancel = () => {
    setShowForm(false); setEditingBlog(null);
    setFormData({ title: '', excerpt: '', content: '', published: false });
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div data-testid="admin-blogs-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Blog Management</h1>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
              data-testid="create-blog-button">
              <FaPlus /> Create New Blog
            </button>
          )}
        </div>

        {showForm ? (
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="Blog post title" data-testid="blog-title-input" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Excerpt (Optional)</label>
                <input type="text" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="Short summary for blog listing" data-testid="blog-excerpt-input" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Content</label>
                <textarea required rows="12" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="Write your blog content here..." data-testid="blog-content-input" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5" data-testid="blog-published-checkbox" />
                <label htmlFor="published" className="text-gray-300">Publish immediately (make visible to public)</label>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition" data-testid="save-blog-button">
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
                <button type="button" onClick={handleCancel} className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition" data-testid="cancel-blog-button">Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-purple-500/20 text-center text-gray-400">
                <p>No blog posts yet. Create your first one!</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20" data-testid={`blog-${blog.id}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{blog.title}</h3>
                        {blog.published ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500 text-green-300 rounded-full text-xs"><FaEye /> Published</span>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 bg-gray-500/20 border border-gray-500 text-gray-300 rounded-full text-xs"><FaEyeSlash /> Draft</span>
                        )}
                      </div>
                      {blog.excerpt && <p className="text-gray-400 mb-3">{blog.excerpt}</p>}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By {blog.author}</span><span>•</span>
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleEdit(blog)}
                        className="p-3 bg-blue-600/20 border border-blue-500 text-blue-300 rounded-lg hover:bg-blue-600/30 transition"
                        data-testid={`edit-blog-${blog.id}-button`}><FaEdit /></button>
                      <button onClick={() => handleDelete(blog.id)}
                        className="p-3 bg-red-600/20 border border-red-500 text-red-300 rounded-lg hover:bg-red-600/30 transition"
                        data-testid={`delete-blog-${blog.id}-button`}><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
