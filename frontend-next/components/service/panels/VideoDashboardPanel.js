'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaEye, FaGlobeAmericas, FaChartLine } from 'react-icons/fa';
import CountUp from 'react-countup';

/**
 * VideoDashboardPanel
 *
 * Decorative right-column panel for the Video Promotion service page.
 * Shows a fake "Campaign Dashboard" with:
 * - YouTube thumbnail mockup with pulsing LIVE dot
 * - Animated 7-day view growth bar chart
 * - Floating stat chips
 * - A ticking view counter
 *
 * Purely visual — zero interactive logic.
 */
export default function VideoDashboardPanel() {
  // 7-day mock data for the bar chart
  const bars = [35, 45, 40, 65, 80, 70, 95];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* ── Fake YouTube Thumbnail ──────────────── */}
      <div className="relative bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-red-500/20 rounded-2xl p-5 overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500" />

        {/* Thumbnail area */}
        <div className="relative bg-black/40 rounded-xl aspect-video flex items-center justify-center mb-4 overflow-hidden">
          {/* Fake gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-orange-500/10" />
          {/* Play button */}
          <motion.div
            className="w-14 h-14 rounded-full bg-red-500/90 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] z-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FaPlay className="text-white text-lg ml-1" />
          </motion.div>

          {/* LIVE badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-md">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>

          {/* View count overlay */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded font-mono">
            <CountUp end={12847} duration={3} separator="," /> views
          </div>
        </div>

        {/* Video title mock */}
        <div className="h-3 bg-white/10 rounded-full w-3/4 mb-2" />
        <div className="h-2.5 bg-white/5 rounded-full w-1/2" />
      </div>

      {/* ── 7-Day Growth Chart ──────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <FaChartLine className="text-red-400" /> Weekly Growth
          </h4>
          <span className="text-xs text-emerald-400 font-semibold">+47%</span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-28">
          {bars.map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                className="w-full bg-gradient-to-t from-red-500 to-orange-400 rounded-t-md"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
              />
              <span className="text-[10px] text-gray-500 font-medium">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating Stat Chips ────────────────── */}
      <div className="space-y-2.5">
        {[
          { icon: <FaEye className="text-red-400" />, label: 'Real Views', value: '100%', sub: 'No bots' },
          { icon: <FaGlobeAmericas className="text-orange-400" />, label: 'Geo Targeting', value: '50+', sub: 'Countries' },
          { icon: <FaChartLine className="text-yellow-400" />, label: 'Algorithm Boost', value: '3.2×', sub: 'Avg reach' },
        ].map((chip, i) => (
          <motion.div
            key={chip.label}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-red-500/25 transition-colors duration-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
          >
            <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              {chip.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">{chip.label}</p>
              <p className="text-sm font-bold text-white">{chip.value}</p>
            </div>
            <span className="text-[10px] text-gray-600 font-medium">{chip.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Live Counter ──────────────────────── */}
      <motion.div
        className="bg-gradient-to-r from-red-900/30 to-orange-900/20 border border-red-500/15 rounded-2xl p-4 text-center"
        animate={{ boxShadow: ['0 0 15px rgba(239,68,68,0.05)', '0 0 25px rgba(239,68,68,0.15)', '0 0 15px rgba(239,68,68,0.05)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Views Delivered</p>
        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
          <CountUp end={2847563} duration={4} separator="," />
        </p>
      </motion.div>
    </motion.div>
  );
}
