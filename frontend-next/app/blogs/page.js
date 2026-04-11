'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogAPI } from '@/lib/api';
import { FaArrowLeft, FaCalendar, FaUser, FaRocket, FaPen, FaBullhorn, FaChartLine } from 'react-icons/fa';

/* ─── Upcoming topics teaser ─────────────────────────────── */
const UPCOMING = [
  { icon: <FaRocket className="text-2xl text-purple-400" />, title: "How to Grow Your YouTube Channel in 2025", tag: "Growth" },
  { icon: <FaPen className="text-2xl text-pink-400" />, title: "The Creator's Guide to Video SEO", tag: "SEO" },
  { icon: <FaBullhorn className="text-2xl text-indigo-400" />, title: "Mastering Social Media Promotion", tag: "Marketing" },
  { icon: <FaChartLine className="text-2xl text-green-400" />, title: "10 Metrics Every Creator Should Track", tag: "Analytics" },
];

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAll(true);
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">

      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-black/30 backdrop-blur-md border-b border-purple-500/20">
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

      {/* Page content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        {/* Hero heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Our{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Insights, strategies, and tips to help creators grow faster and smarter.
          </p>
        </motion.div>

        {/* Show published blogs if any */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={`/blog/${blog.id}`} className="group block h-full">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                        Article
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition flex-1">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-gray-400 mb-4 text-sm line-clamp-3">{blog.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
                      <span className="flex items-center gap-1"><FaUser /> {blog.author}</span>
                      <span className="flex items-center gap-1"><FaCalendar /> {new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : null}

        {/* Coming soon section — always show when no blogs yet */}
        {blogs.length === 0 && (
          <>
            {/* Big hero card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-purple-500/40 p-12 rounded-3xl text-center mb-14 shadow-[0_0_60px_rgba(168,85,247,0.1)]"
            >
              {/* Decorative glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[80px] opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,1) 0%, transparent 70%)' }} />

              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  <span className="text-5xl">✍️</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Great Content Coming Soon
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                  Our team is crafting in-depth guides and insights for creators like you.
                  Stay ahead of the curve — subscribe to get notified first.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                  >
                    Chat on WhatsApp
                  </a>
                  <a
                    href="mailto:team@socialfootholds.com"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Upcoming articles preview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">What to Expect</h2>
              <p className="text-gray-500 text-center mb-8">Topics our team is working on right now</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {UPCOMING.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/40 hover:bg-white/8 transition-all duration-300 group"
                  >
                    <div className="mb-3">{item.icon}</div>
                    <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">{item.tag}</span>
                    <p className="text-white text-sm font-semibold mt-1 leading-snug group-hover:text-purple-300 transition">
                      {item.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
