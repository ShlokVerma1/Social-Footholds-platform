'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaCheckCircle } from 'react-icons/fa';

/**
 * BrowserPreviewPanel
 *
 * Decorative right-column panel for the Web & Blogs service page.
 * Shows: browser window mockup with fake blog post,
 * code bracket decorations, and a Published badge. Purely visual.
 */
export default function BrowserPreviewPanel() {
  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* ── Browser Window Mockup ─────────────── */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/20 border border-indigo-500/20 rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />

        {/* Title bar */}
        <div className="bg-black/40 px-4 py-2.5 flex items-center gap-3 border-b border-white/5">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          {/* URL bar */}
          <div className="flex-1 bg-white/5 rounded-md px-3 py-1 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono truncate">socialfootholds.com/your-blog</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-5 space-y-4">
          {/* Hero image area */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-violet-500/10 rounded-lg h-28 flex items-center justify-center">
            <motion.div
              className="text-3xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌐
            </motion.div>
          </div>

          {/* Article title */}
          <div>
            <div className="h-4 bg-white/15 rounded-md w-4/5 mb-2" />
            <div className="h-3 bg-white/8 rounded-md w-3/5" />
          </div>

          {/* Text lines */}
          <div className="space-y-1.5">
            <div className="h-2 bg-white/5 rounded w-full" />
            <div className="h-2 bg-white/5 rounded w-11/12" />
            <div className="h-2 bg-white/5 rounded w-4/5" />
            <div className="h-2 bg-white/5 rounded w-full" />
            <div className="h-2 bg-white/5 rounded w-3/4" />
          </div>

          {/* Read More button */}
          <div className="w-24 h-7 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-md flex items-center justify-center">
            <span className="text-[10px] text-white font-semibold">Read More</span>
          </div>
        </div>
      </div>

      {/* ── Code Decoration ───────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FaCode className="text-indigo-400" /> Built with Modern Tech
        </h4>
        {/* Code snippet mockup */}
        <div className="bg-black/40 rounded-lg p-3 font-mono text-[11px] space-y-1">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <span className="text-purple-400">{'<'}</span>
            <span className="text-indigo-300">{'article'}</span>
            <span className="text-purple-400">{'>'}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="pl-4">
            <span className="text-purple-400">{'<'}</span>
            <span className="text-indigo-300">{'h1'}</span>
            <span className="text-purple-400">{'>'}</span>
            <span className="text-gray-300">Your Blog Post</span>
            <span className="text-purple-400">{'</'}</span>
            <span className="text-indigo-300">{'h1'}</span>
            <span className="text-purple-400">{'>'}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="pl-4">
            <span className="text-purple-400">{'<'}</span>
            <span className="text-indigo-300">{'p'}</span>
            <span className="text-purple-400">{'>'}</span>
            <span className="text-gray-500">Engaging content...</span>
            <span className="text-purple-400">{'</'}</span>
            <span className="text-indigo-300">{'p'}</span>
            <span className="text-purple-400">{'>'}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            <span className="text-purple-400">{'</'}</span>
            <span className="text-indigo-300">{'article'}</span>
            <span className="text-purple-400">{'>'}</span>
          </motion.div>
        </div>
      </div>

      {/* ── Tech Stack ────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {['Next.js', 'React', 'SEO', 'Responsive', 'Fast'].map((tag, i) => (
          <motion.div
            key={tag}
            className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
          >
            {tag}
          </motion.div>
        ))}
      </div>

      {/* ── Published Badge ───────────────────── */}
      <motion.div
        className="bg-gradient-to-r from-indigo-900/30 to-violet-900/20 border border-indigo-500/15 rounded-2xl p-4 flex items-center gap-3"
        animate={{ boxShadow: ['0 0 15px rgba(99,102,241,0.05)', '0 0 25px rgba(99,102,241,0.15)', '0 0 15px rgba(99,102,241,0.05)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <FaCheckCircle className="text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Status</p>
          <p className="text-sm font-bold text-emerald-400">Published & Live</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
