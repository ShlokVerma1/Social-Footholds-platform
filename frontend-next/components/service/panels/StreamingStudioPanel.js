'use client'

import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

/**
 * StreamingStudioPanel
 *
 * Decorative right-column panel for the Music Promotion service page.
 * Shows: rotating vinyl disc, animated equalizer bars, platform badges,
 * and a stream counter. Purely visual.
 */
export default function StreamingStudioPanel() {
  // 12-bar equalizer heights cycle
  const eqBars = [60, 85, 45, 90, 55, 75, 40, 95, 50, 70, 80, 65];

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* ── Vinyl Record ──────────────────────── */}
      <div className="relative bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/20 rounded-2xl p-5 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />

        <motion.div
          className="relative w-44 h-44"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {/* Outer disc */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Record surface */}
            <circle cx="100" cy="100" r="94" fill="rgba(0,0,0,0.6)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
            {/* Grooves */}
            {[85, 75, 65, 55, 45].map((r, i) => (
              <circle key={i} cx="100" cy="100" r={r} fill="none"
                stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"
              />
            ))}
            {/* Label area */}
            <circle cx="100" cy="100" r="30" fill="rgba(34,197,94,0.25)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
            <circle cx="100" cy="100" r="8" fill="rgba(34,197,94,0.6)" />
            {/* Highlight reflection */}
            <ellipse cx="70" cy="70" rx="40" ry="15" fill="rgba(255,255,255,0.03)" transform="rotate(-30 70 70)" />
          </svg>
        </motion.div>

        {/* NOW PLAYING badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Playing
        </div>
      </div>

      {/* ── Equalizer ─────────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-green-400">♫</span> Audio Spectrum
        </h4>
        <div className="flex items-end gap-1.5 h-24 justify-center">
          {eqBars.map((base, i) => (
            <motion.div
              key={i}
              className="w-3 bg-gradient-to-t from-green-500 to-emerald-300 rounded-t-sm"
              animate={{ height: [`${base * 0.3}%`, `${base}%`, `${base * 0.5}%`, `${base * 0.9}%`, `${base * 0.3}%`] }}
              transition={{
                duration: 1.2 + i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.08,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Platform Badges ───────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Spotify', color: 'from-green-600 to-green-700', border: 'border-green-500/30' },
          { name: 'Apple Music', color: 'from-pink-600 to-red-600', border: 'border-pink-500/30' },
        ].map((platform) => (
          <div key={platform.name}
            className={`bg-gradient-to-br ${platform.color} bg-opacity-20 border ${platform.border} rounded-xl p-3.5 text-center`}
            style={{ background: undefined }}
          >
            <div className={`bg-gradient-to-br ${platform.color} rounded-lg p-3 mb-2 mx-auto w-fit`}>
              <span className="text-white text-lg font-bold">{platform.name === 'Spotify' ? '♪' : '♫'}</span>
            </div>
            <p className="text-xs text-white font-semibold">{platform.name}</p>
          </div>
        ))}
      </div>

      {/* ── Stream Counter ────────────────────── */}
      <motion.div
        className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 border border-green-500/15 rounded-2xl p-4 text-center"
        animate={{ boxShadow: ['0 0 15px rgba(34,197,94,0.05)', '0 0 25px rgba(34,197,94,0.15)', '0 0 15px rgba(34,197,94,0.05)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Streams Delivered</p>
        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
          <CountUp end={1254890} duration={4} separator="," />
        </p>
      </motion.div>
    </motion.div>
  );
}
