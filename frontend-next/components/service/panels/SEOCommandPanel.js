'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaCheckCircle } from 'react-icons/fa';

/**
 * SEOCommandPanel
 *
 * Decorative right-column panel for the Channel SEO service page.
 * Shows: large SVG score arc, keyword rank rows, subscriber growth chart,
 * and a channel health indicator. Purely visual.
 */
export default function SEOCommandPanel() {
  // SVG arc for score ring
  const size = 160;
  const strokeW = 10;
  const radius = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const score = 87;
  const offset = circumference * (1 - score / 100);

  // Fake keyword data
  const keywords = [
    { term: 'youtube growth', rank: 3, trend: '↑2' },
    { term: 'video seo tips', rank: 7, trend: '↑5' },
    { term: 'channel optimization', rank: 12, trend: '↑8' },
    { term: 'thumbnail design', rank: 5, trend: '↑1' },
  ];

  // Mini chart bars (subscribers/day)
  const subBars = [30, 45, 55, 40, 70, 85, 90, 75, 95, 80, 88, 92];

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* ── SEO Score Ring ─────────────────────── */}
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/20 rounded-2xl p-6 flex flex-col items-center overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">SEO Health Score</p>

        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle cx={size/2} cy={size/2} r={radius}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW}
            />
            {/* Score arc */}
            <motion.circle
              cx={size/2} cy={size/2} r={radius}
              fill="none" stroke="url(#seoGrad)" strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, ease: 'easeOut', delay: 0.6 }}
            />
            <defs>
              <linearGradient id="seoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          {/* Score number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-extrabold text-white">{score}</p>
            <p className="text-xs text-blue-400 font-semibold">Excellent</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3">
          <FaCheckCircle className="text-emerald-400 text-xs" />
          <span className="text-xs text-gray-400">Updated today</span>
        </div>
      </div>

      {/* ── Keyword Rankings ───────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4">Keyword Rankings</h4>
        <div className="space-y-2.5">
          {keywords.map((kw, i) => (
            <motion.div
              key={kw.term}
              className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl p-2.5 hover:border-blue-500/20 transition-colors"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.8 + i * 0.08 }}
            >
              {/* Rank badge */}
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-300">
                #{kw.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">{kw.term}</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <FaArrowUp className="text-[9px]" />
                {kw.trend}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Subscriber Growth Mini Chart ───────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Subs / Day</h4>
          <span className="text-xs text-emerald-400 font-semibold">+23%</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {subBars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.05, ease: 'easeOut' }}
            />
          ))}
        </div>
      </div>

      {/* ── Channel Health ────────────────────── */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-500/15 rounded-2xl p-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 text-center">Channel Health</p>
        <div className="space-y-2">
          {[
            { label: 'Watch Time', pct: 92, color: 'from-blue-500 to-blue-400' },
            { label: 'CTR', pct: 78, color: 'from-indigo-500 to-indigo-400' },
            { label: 'Retention', pct: 85, color: 'from-violet-500 to-violet-400' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white font-semibold">{item.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
