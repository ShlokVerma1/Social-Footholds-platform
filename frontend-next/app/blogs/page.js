'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogAPI } from '@/lib/api';
import { FaArrowLeft, FaCalendar, FaUser } from 'react-icons/fa';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAll(true);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Footholds
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10">
                Home
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Blog List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Blog</h1>
        <p className="text-gray-400 mb-12">Latest insights, tips, and updates for content creators</p>

        {/* Coming Soon Message */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 p-12 rounded-2xl text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📝</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Blog Coming Soon!</h2>
          <p className="text-gray-300 text-lg mb-6">
            We're crafting valuable content for creators. Stay tuned for insights, tips, and industry updates!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition"
            >
              Contact on WhatsApp
            </a>
            <a
              href="mailto:team@socialfootholds.com"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
            >
              Email Us
            </a>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.id}`} className="group">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition hover:transform hover:scale-105 h-full">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="text-gray-400 mb-4 line-clamp-3">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaUser className="mr-2" /> {blog.author}
                    </span>
                    <span className="flex items-center">
                      <FaCalendar className="mr-2" /> {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
