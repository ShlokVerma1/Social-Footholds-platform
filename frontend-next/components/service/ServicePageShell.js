'use client'

import React from 'react';
import { motion } from 'framer-motion';

// ── Shared animated dot grid ──────────────────────────
const DotGrid = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-40 -z-0"
    style={{
      backgroundImage: 'radial-gradient(rgba(168,85,247,0.3) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      maskImage: 'radial-gradient(ellipse 70% 50% at 50% 30%, black 30%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 30%, black 30%, transparent 100%)',
    }}
  />
);

/**
 * ServicePageShell
 *
 * Shared graphical wrapper for ALL service pages.
 * Provides: aurora orbs, dot grid, drifting polygon SVG,
 * a premium hero header, and a 2-column desktop layout
 * with an optional sticky right-side graphics panel.
 *
 * Props:
 *  - rightPanel: optional JSX element rendered in a sticky right column on lg+ screens
 *  - All other props are purely visual overrides (colours, icons, labels)
 *  - children: the form/content for the left column
 */
export default function ServicePageShell({
  title,
  description,
  accentIcon,
  iconBgFrom = 'from-purple-600',
  iconBgTo   = 'to-pink-600',
  orb1 = 'rgba(168,85,247,0.18)',
  orb2 = 'rgba(236,72,153,0.12)',
  orb3 = 'rgba(99,102,241,0.08)',
  polygonStroke = '#a855f7',
  badge    = 'Live Service',
  badgeDot = 'bg-emerald-400',
  // Optional: decorative right panel (only visible on lg+ screens)
  rightPanel,
  children,
}) {
  return (
    <div className="relative">

      {/* ── DOT GRID ─────────────────────────────────── */}
      <DotGrid />

      {/* ── AURORA ORBS (fixed, behind everything) ───── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-[-5%] right-[-5%] w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${orb1} 0%, transparent 70%)` }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[5%] w-[380px] h-[380px] rounded-full"
          style={{ background: `radial-gradient(circle, ${orb2} 0%, transparent 70%)` }}
          animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.div
          className="absolute top-[45%] left-[35%] w-[280px] h-[280px] rounded-full"
          style={{ background: `radial-gradient(circle, ${orb3} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
        />
      </div>

      {/* ── DRIFTING POLYGON DECORATION ──────────────── */}
      <motion.svg
        className="absolute top-0 right-0 w-36 h-36 opacity-10 pointer-events-none"
        viewBox="0 0 144 144"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      >
        <polygon
          points="72,8 128,40 128,104 72,136 16,104 16,40"
          fill="none" stroke={polygonStroke} strokeWidth="1.5"
        />
        <polygon
          points="72,28 108,50 108,94 72,116 36,94 36,50"
          fill="none" stroke={polygonStroke} strokeWidth="0.5" strokeDasharray="4 4"
        />
        <circle cx="72" cy="72" r="18" fill="none" stroke={polygonStroke} strokeWidth="0.5" opacity="0.6" />
      </motion.svg>

      {/* ── HERO HEADER ──────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-10"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Icon + spinning rings */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-20 h-20">
          <motion.svg
            className="absolute"
            style={{ width: 96, height: 96, top: -8, left: -8 }}
            viewBox="0 0 96 96"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="48" cy="48" r="44" fill="none"
              stroke={polygonStroke} strokeWidth="1.5"
              strokeDasharray="6 4" opacity="0.6"
            />
          </motion.svg>
          <motion.svg
            className="absolute"
            style={{ width: 96, height: 96, top: -8, left: -8 }}
            viewBox="0 0 96 96"
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="48" cy="48" r="35" fill="none"
              stroke={polygonStroke} strokeWidth="0.5"
              strokeDasharray="2 6" opacity="0.35"
            />
          </motion.svg>
          <div className={`relative w-20 h-20 bg-gradient-to-br ${iconBgFrom} ${iconBgTo} rounded-2xl flex items-center justify-center shadow-[0_0_35px_rgba(168,85,247,0.45)] z-10 text-4xl text-white`}>
            {accentIcon}
          </div>
        </div>

        {/* Title, badge, description */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase
            bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full mb-3">
            <div className={`w-1.5 h-1.5 rounded-full ${badgeDot} animate-pulse`} />
            {badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold
            bg-gradient-to-r from-white via-purple-200 to-pink-200
            bg-clip-text text-transparent mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-gray-400 text-base leading-relaxed max-w-xl">{description}</p>
          )}
        </div>
      </motion.div>

      {/* ── TWO-COLUMN LAYOUT (desktop) ───────────────── */}
      {/* Left: form/content | Right: sticky decorative panel */}
      <div className={`relative z-10 ${rightPanel ? 'lg:flex lg:gap-8' : ''}`}>
        {/* Left column — all form content */}
        <div className={rightPanel ? 'lg:flex-1 min-w-0' : ''}>
          {children}
        </div>

        {/* Right column — decorative graphic panel (hidden on mobile) */}
        {rightPanel && (
          <div className="hidden lg:block lg:w-[340px] xl:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              {rightPanel}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
