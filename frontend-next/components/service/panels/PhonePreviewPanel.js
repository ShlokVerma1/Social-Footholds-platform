'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaHeart, FaShareAlt } from 'react-icons/fa';

/**
 * PhonePreviewPanel
 *
 * Decorative right-column panel for the Shorts Creation service page.
 * Shows: portrait phone silhouette with a live "Short" playing,
 * clip thumbnails, and a Trending badge. Purely visual.
 */
export default function PhonePreviewPanel() {
  // 3 clip thumbnails
  const clips = [
    { bg: 'from-pink-600/30 to-rose-500/20', label: 'Clip 1' },
    { bg: 'from-purple-600/30 to-pink-500/20', label: 'Clip 2' },
    { bg: 'from-rose-600/30 to-orange-500/20', label: 'Clip 3' },
  ];

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* ── Phone Preview ─────────────────────── */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Phone frame */}
          <div className="w-[180px] bg-black/60 border-2 border-white/15 rounded-[28px] p-2 shadow-[0_0_40px_rgba(236,72,153,0.15)]">
            {/* Notch */}
            <div className="w-16 h-4 bg-black rounded-full mx-auto mb-2 border border-white/10" />

            {/* Screen content */}
            <div className="bg-gradient-to-b from-pink-900/40 to-rose-900/30 rounded-2xl aspect-[9/16] relative overflow-hidden">
              {/* Simulated short content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-4xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🎬
                </motion.div>
              </div>

              {/* Shorts progress bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Right-side icons (like TikTok/Shorts) */}
              <div className="absolute right-2 bottom-12 space-y-4">
                {[
                  { icon: <FaHeart className="text-pink-400" />, count: '24K' },
                  { icon: <FaShareAlt className="text-white/60" />, count: '1.2K' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center gap-0.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.2 }}
                  >
                    <div className="text-lg">{item.icon}</div>
                    <span className="text-[8px] text-white/60 font-bold">{item.count}</span>
                  </motion.div>
                ))}
              </div>

              {/* Username overlay */}
              <div className="absolute bottom-4 left-2">
                <div className="h-2 bg-white/20 rounded w-16 mb-1" />
                <div className="h-1.5 bg-white/10 rounded w-12" />
              </div>
            </div>

            {/* Home bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2" />
          </div>

          {/* Trending badge floating */}
          <motion.div
            className="absolute -top-2 -right-4 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FaFire /> Trending
          </motion.div>
        </div>
      </div>

      {/* ── Clip Thumbnails ────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4">Your Shorts Queue</h4>
        <div className="space-y-2.5">
          {clips.map((clip, i) => (
            <motion.div
              key={clip.label}
              className={`flex items-center gap-3 bg-gradient-to-r ${clip.bg} border border-white/[0.06] rounded-xl p-3 hover:border-pink-500/25 transition-colors`}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.8 + i * 0.1 }}
            >
              {/* Mini thumbnail */}
              <div className="w-12 h-16 bg-black/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🎬</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium">{clip.label}</p>
                <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${40 + i * 25}%` }}
                    transition={{ duration: 1, delay: 1 + i * 0.2 }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Processing...</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Avg Views', value: '45K', color: 'text-pink-400' },
          { label: 'Engagement', value: '12.4%', color: 'text-rose-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
