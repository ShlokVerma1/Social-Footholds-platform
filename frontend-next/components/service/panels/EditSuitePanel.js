'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaCut, FaPalette, FaVolumeUp } from 'react-icons/fa';

/**
 * EditSuitePanel
 *
 * Decorative right-column panel for the Video Editing service page.
 * Shows: film strip, 3-track editing timeline mockup, color grading circles,
 * and an animated scissors cut. Purely visual.
 */
export default function EditSuitePanel() {
  // Film strip frame colors to simulate footage clips
  const frames = ['#7c3aed', '#6366f1', '#8b5cf6', '#a855f7', '#7c3aed', '#6366f1', '#8b5cf6', '#a855f7'];

  // Timeline tracks
  const tracks = [
    { label: 'Video', color: 'bg-purple-500', segments: [60, 25, 15] },
    { label: 'Audio', color: 'bg-violet-400', segments: [40, 35, 25] },
    { label: 'FX',    color: 'bg-pink-500',   segments: [20, 30, 50] },
  ];

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* ── Film Strip ────────────────────────── */}
      <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/20 border border-purple-500/20 rounded-2xl p-5 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500" />
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Film Strip</p>
        {/* Strip with sprocket holes */}
        <div className="relative bg-black/50 rounded-lg p-2">
          {/* Top sprocket row */}
          <div className="flex gap-[12px] mb-1.5 px-1">
            {frames.map((_, i) => (
              <div key={`t${i}`} className="w-[10px] h-[6px] bg-white/10 rounded-sm flex-shrink-0" />
            ))}
          </div>
          {/* Frames */}
          <div className="flex gap-1.5 overflow-hidden">
            {frames.map((color, i) => (
              <motion.div
                key={i}
                className="flex-1 aspect-[4/3] rounded-sm"
                style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
              />
            ))}
          </div>
          {/* Bottom sprocket row */}
          <div className="flex gap-[12px] mt-1.5 px-1">
            {frames.map((_, i) => (
              <div key={`b${i}`} className="w-[10px] h-[6px] bg-white/10 rounded-sm flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Timeline ──────────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4">Editing Timeline</h4>
        <div className="space-y-3">
          {tracks.map((track, i) => (
            <div key={track.label}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-2 h-2 rounded-full ${track.color}`} />
                <span className="text-xs text-gray-400 font-medium">{track.label}</span>
              </div>
              <div className="flex gap-1 h-5 rounded-md overflow-hidden">
                {track.segments.map((width, j) => (
                  <motion.div
                    key={j}
                    className={`${track.color} rounded-sm`}
                    style={{ opacity: 0.3 + j * 0.25 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.15 + j * 0.1, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Playhead indicator */}
        <div className="relative mt-3 h-4">
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/5 rounded" />
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            initial={{ left: '0%' }}
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      {/* ── Color Grading Wheels ──────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FaPalette className="text-purple-400" /> Color Grading
        </h4>
        <div className="flex gap-3 justify-center">
          {[
            { label: 'Lift', inner: '#ef4444', outer: 'rgba(239,68,68,0.15)' },
            { label: 'Gamma', inner: '#22c55e', outer: 'rgba(34,197,94,0.15)' },
            { label: 'Gain', inner: '#3b82f6', outer: 'rgba(59,130,246,0.15)' },
          ].map((wheel) => (
            <div key={wheel.label} className="flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center relative"
                style={{ background: wheel.outer }}>
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ background: wheel.inner }}
                  animate={{ x: [0, 4, -2, 0], y: [0, -3, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Crosshair */}
                <div className="absolute top-1/2 left-2 right-2 h-[0.5px] bg-white/10" />
                <div className="absolute left-1/2 top-2 bottom-2 w-[0.5px] bg-white/10" />
              </div>
              <span className="text-[10px] text-gray-500">{wheel.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scissors Cut Animation ────────────── */}
      <motion.div
        className="bg-gradient-to-r from-purple-900/30 to-violet-900/20 border border-purple-500/15 rounded-2xl p-4 flex items-center justify-center gap-3"
        animate={{ boxShadow: ['0 0 15px rgba(168,85,247,0.05)', '0 0 25px rgba(168,85,247,0.15)', '0 0 15px rgba(168,85,247,0.05)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.div
          animate={{ rotate: [0, -15, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <FaCut className="text-purple-400 text-xl" />
        </motion.div>
        <div>
          <p className="text-xs text-gray-400">Professional Cuts</p>
          <p className="text-sm font-bold text-white">Frame-perfect editing</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
