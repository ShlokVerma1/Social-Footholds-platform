'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CreatorLayout from '@/components/CreatorLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { serviceAPI } from '@/lib/api';
import {
  FaYoutube, FaMusic, FaSearch, FaFilm, FaMobileAlt, FaGlobe,
  FaArrowRight, FaCheckCircle, FaClock, FaTimesCircle,
  FaShoppingBag, FaStar, FaRocket, FaTimes, FaCalendar,
  FaDollarSign, FaCommentDots, FaFlag,
} from 'react-icons/fa';
import CountUp from 'react-countup';

// ─────────────────────────────────────────────────
// SERVICE MILESTONES
// ─────────────────────────────────────────────────
const SERVICE_MILESTONES = {
  'Video Promotion': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Content Review', icon: '🔍' },
    { label: 'Campaign Setup', icon: '⚙️' },
    { label: 'Campaign Live', icon: '🚀' },
    { label: 'Results Delivered', icon: '📊' },
    { label: 'Completed', icon: '✅' },
  ],
  'Music Promotion': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Track Review', icon: '🎵' },
    { label: 'Playlist Outreach', icon: '📢' },
    { label: 'Placement Confirmed', icon: '🎯' },
    { label: 'Streams Growing', icon: '📈' },
    { label: 'Completed', icon: '✅' },
  ],
  'Channel SEO Optimization': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Channel Audit', icon: '🔎' },
    { label: 'Strategy Prepared', icon: '📝' },
    { label: 'Optimisation Live', icon: '⚡' },
    { label: 'Monitoring', icon: '👁️' },
    { label: 'Completed', icon: '✅' },
  ],
  'Video Editing': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Brief Review', icon: '📄' },
    { label: 'Editing In Progress', icon: '✂️' },
    { label: 'First Draft Sent', icon: '📤' },
    { label: 'Revisions', icon: '🔄' },
    { label: 'Final Delivered', icon: '✅' },
  ],
  'Shorts Creation': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Content Review', icon: '🔍' },
    { label: 'Editing In Progress', icon: '✂️' },
    { label: 'Draft Sent', icon: '📤' },
    { label: 'Revisions', icon: '🔄' },
    { label: 'Final Delivered', icon: '✅' },
  ],
  'Web Page & Blogs': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Brief Review', icon: '📄' },
    { label: 'Design & Writing', icon: '🎨' },
    { label: 'Review & Feedback', icon: '💬' },
    { label: 'Revisions', icon: '🔄' },
    { label: 'Live & Delivered', icon: '✅' },
  ],
};

function getMilestones(serviceName) {
  const key = Object.keys(SERVICE_MILESTONES).find(
    (k) => k.toLowerCase() === (serviceName || '').toLowerCase()
  );
  return key ? SERVICE_MILESTONES[key] : null;
}

// ─────────────────────────────────────────────────
// SHARED UTILS
// ─────────────────────────────────────────────────
const serviceIcons = {
  'Video Promotion':          <FaYoutube className="text-red-500" />,
  'Music Promotion':          <FaMusic className="text-green-500" />,
  'Channel SEO Optimization': <FaSearch className="text-blue-500" />,
  'Video Editing':            <FaFilm className="text-purple-500" />,
  'Shorts Creation':          <FaMobileAlt className="text-pink-500" />,
  'Web Page & Blogs':         <FaGlobe className="text-indigo-500" />,
};

const serviceRoutes = {
  'Video Promotion':          '/services/video-promotion',
  'Music Promotion':          '/services/music-promotion',
  'Channel SEO Optimization': '/services/channel-seo',
  'Video Editing':            '/services/video-editing',
  'Shorts Creation':          '/services/shorts-creation',
  'Web Page & Blogs':         '/services/web-blogs',
};

const STATUS_STYLES = {
  pending:    { dot: 'bg-amber-400',  badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400'   },
  processing: { dot: 'bg-blue-400',   badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400'      },
  completed:  { dot: 'bg-emerald-400',badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  cancelled:  { dot: 'bg-red-400',    badge: 'bg-red-500/10 border-red-500/30 text-red-400'         },
};
function statusStyle(s) { return STATUS_STYLES[s] || STATUS_STYLES.pending; }

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}
function shortId(id = '') { return String(id).slice(0, 8); }

// ─────────────────────────────────────────────────
// MILESTONE TRACKER (horizontal)
// ─────────────────────────────────────────────────
function MilestoneTracker({ serviceName, currentMilestone, compact = false }) {
  const milestones = getMilestones(serviceName);
  if (!milestones) return null;

  const current = Number(currentMilestone ?? 0);
  const pct = milestones.length > 1 ? (current / (milestones.length - 1)) * 100 : 0;

  return (
    <div className="w-full">
      {/* Step row */}
      <div className="relative flex items-start justify-between">
        {/* Track line background */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10 z-0" />
        {/* Fill line */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 z-0 transition-all duration-700"
          style={{ width: `calc(${pct}% * (100% - 32px) / 100)` }}
        />

        {milestones.map((step, idx) => {
          const isDone    = idx < current;
          const isActive  = idx === current;
          const isFuture  = idx > current;
          return (
            <div
              key={idx}
              className={`relative z-10 flex flex-col items-center ${compact ? 'gap-1' : 'gap-2'}`}
              style={{ width: `${100 / milestones.length}%` }}
            >
              {/* Circle */}
              <div
                className={`
                  flex items-center justify-center rounded-full transition-all duration-300
                  ${compact ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base'}
                  ${isDone   ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : ''}
                  ${isActive ? 'bg-purple-600/30 ring-2 ring-purple-400 ring-offset-1 ring-offset-transparent shadow-[0_0_14px_rgba(168,85,247,0.6)]' : ''}
                  ${isFuture ? 'border-2 border-white/15 bg-white/3' : ''}
                `}
              >
                <span className={`leading-none ${isFuture ? 'opacity-30' : ''} ${isActive ? 'animate-pulse' : ''}`}>
                  {step.icon}
                </span>
              </div>
              {/* Label */}
              {!compact && (
                <span className={`text-center text-[10px] leading-tight max-w-[60px] ${
                  isDone ? 'text-purple-300' : isActive ? 'text-purple-300 font-semibold' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Current stage label */}
      {!compact && (
        <p className="text-center text-xs text-purple-400 font-semibold mt-3">
          {milestones[current]?.icon} {milestones[current]?.label}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <div className="h-3 bg-white/5 rounded w-1/3" />
        </div>
        <div className="h-5 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="h-9 bg-white/5 rounded-xl" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
  );
}

// ─────────────────────────────────────────────────
// ORDER DETAIL MODAL
// ─────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  const overlayRef = useRef(null);
  const ss = statusStyle(order.status);
  const milestones = getMilestones(order.service_name);
  const current = Number(order.current_milestone ?? 0);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="w-full max-w-lg bg-gradient-to-b from-[#13131f] to-[#0d0d1a] border border-purple-500/20 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#13131f]/95 backdrop-blur-xl border-b border-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{serviceIcons[order.service_name] || <FaShoppingBag className="text-purple-400" />}</div>
              <div>
                <h2 className="text-base font-bold text-white">{order.service_name}</h2>
                <p className="text-xs text-gray-500 font-mono">#{shortId(order.id)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition"
            >
              <FaTimes />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Status + Amount row */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${ss.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                {order.status}
              </span>
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                ${Number(order.amount || 0).toFixed(2)}
              </p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <FaCalendar className="text-xs text-purple-500" />
                <span>{fmtDate(order.created_at)}</span>
              </div>
              {order.payment_status && (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaDollarSign className="text-xs text-purple-500" />
                  <span className="capitalize">{order.payment_status}</span>
                </div>
              )}
            </div>

            {/* Milestone tracker */}
            {milestones && (
              <div className="bg-white/3 border border-purple-500/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <FaFlag className="text-[10px]" /> Campaign Progress
                </p>
                <MilestoneTracker
                  serviceName={order.service_name}
                  currentMilestone={order.current_milestone}
                />
                {/* Full step list */}
                <div className="mt-4 space-y-1.5">
                  {milestones.map((step, idx) => {
                    const isDone = idx < current;
                    const isActive = idx === current;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg
                          ${isActive ? 'bg-purple-600/15 border border-purple-500/30' : ''}
                        `}
                      >
                        <span className={`text-xs ${!isDone && !isActive ? 'opacity-30' : ''}`}>{step.icon}</span>
                        <span className={
                          isDone ? 'text-purple-300 line-through opacity-60'
                          : isActive ? 'text-white font-semibold'
                          : 'text-gray-600'
                        }>
                          {step.label}
                        </span>
                        {isDone && <FaCheckCircle className="ml-auto text-purple-500 text-xs" />}
                        {isActive && <span className="ml-auto text-[10px] text-purple-400 font-bold uppercase tracking-widest">Current</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Client note */}
            {order.client_notes && (
              <div className="border-l-[3px] border-purple-500 bg-purple-500/5 rounded-r-xl px-4 py-3">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5">
                  💬 Message from our team
                </p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{order.client_notes}</p>
              </div>
            )}

            {/* Order details / description */}
            {order.details?.description && (
              <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Campaign Brief</p>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{order.details.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────
// ACTIVE CAMPAIGN CARD
// ─────────────────────────────────────────────────
function ActiveCampaignCard({ order, onClick, index }) {
  const ss = statusStyle(order.status);
  const milestones = getMilestones(order.service_name);
  const current = Number(order.current_milestone ?? 0);
  const currentLabel = milestones?.[current]?.label || 'In Progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, type: 'spring', stiffness: 200 }}
      onClick={onClick}
      data-testid={`active-campaign-${order.id}`}
      className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-purple-500/15 rounded-2xl p-6 cursor-pointer group hover:bg-white/8 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500/60 via-pink-500/40 to-transparent" />
      {/* Left accent on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
            {serviceIcons[order.service_name] || <FaShoppingBag className="text-purple-400" />}
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight group-hover:text-purple-200 transition-colors">
              {order.service_name}
            </h3>
            <p className="text-gray-600 text-xs font-mono">#{shortId(order.id)}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-purple-400 font-bold text-sm">${Number(order.amount || 0).toFixed(2)}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize mt-1 ${ss.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${ss.dot} ${order.status === 'processing' ? 'animate-pulse' : ''}`} />
            {order.status}
          </span>
        </div>
      </div>

      {/* Milestone tracker */}
      {milestones ? (
        <div className="mb-4">
          <MilestoneTracker
            serviceName={order.service_name}
            currentMilestone={order.current_milestone}
            compact
          />
          <p className="text-center text-xs text-purple-400 font-semibold mt-2">
            {milestones[current]?.icon} {currentLabel}
          </p>
        </div>
      ) : (
        <div className="h-9 flex items-center justify-center text-gray-600 text-xs mb-4">
          No milestone data for this service
        </div>
      )}

      {/* Client note snippet */}
      {order.client_notes && (
        <div className="border-l-2 border-purple-500/60 pl-3 py-1 mb-3 bg-purple-500/5 rounded-r-lg">
          <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mb-0.5">
            💬 Message from team
          </p>
          <p className="text-gray-400 text-xs line-clamp-2">{order.client_notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-gray-600 text-xs flex items-center gap-1">
          <FaCalendar className="text-[9px]" /> {fmtDate(order.created_at)}
        </p>
        <span className="text-purple-400 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View details <FaArrowRight className="text-[9px]" />
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// PAST CAMPAIGN CARD
// ─────────────────────────────────────────────────
function PastCampaignCard({ order, onClick, index }) {
  const ss = statusStyle(order.status);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={onClick}
      data-testid={`past-campaign-${order.id}`}
      className="flex items-center justify-between gap-4 bg-white/5 border border-white/8 rounded-xl px-5 py-4 cursor-pointer hover:bg-white/8 hover:border-purple-500/20 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
          {serviceIcons[order.service_name] || <FaShoppingBag className="text-gray-500" />}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate group-hover:text-purple-200 transition-colors">
            {order.service_name}
          </p>
          <p className="text-gray-600 text-xs">{fmtDate(order.created_at)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <p className="text-gray-300 font-bold text-sm">${Number(order.amount || 0).toFixed(2)}</p>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${ss.badge}`}>
          {order.status}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// SECTION HEADER (preserved)
// ─────────────────────────────────────────────────
const SectionHeader = ({ title, href, hrefLabel, badge }) => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-4 flex-1">
      <h2 className="text-3xl font-bold text-white whitespace-nowrap">{title}</h2>
      {badge != null && (
        <span className="px-2.5 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          {badge}
        </span>
      )}
      <div className="shimmer-line h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 rounded-full" />
    </div>
    {href && (
      <Link href={href} className="text-sm font-semibold text-purple-400 hover:text-pink-400 flex items-center gap-1 transition-colors ml-4">
        {hrefLabel} <FaArrowRight className="text-xs" />
      </Link>
    )}
  </div>
);

// ─────────────────────────────────────────────────
// RADIAL RING (preserved)
// ─────────────────────────────────────────────────
const RadialRing = ({ value, max, color, size = 80, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - pct);
  return (
    <svg width={size} height={size} className="absolute top-4 right-4 opacity-70" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
};

// ─────────────────────────────────────────────────
// CONSTELLATION (preserved)
// ─────────────────────────────────────────────────
const Constellation = () => {
  const points = [
    { x: 15, y: 20 }, { x: 35, y: 8 }, { x: 55, y: 25 }, { x: 75, y: 12 },
    { x: 90, y: 35 }, { x: 70, y: 55 }, { x: 85, y: 75 }, { x: 60, y: 70 },
    { x: 40, y: 85 }, { x: 20, y: 65 }, { x: 5, y: 50 }, { x: 25, y: 40 },
    { x: 50, y: 50 }, { x: 45, y: 30 }, { x: 65, y: 40 },
  ];
  const lines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
    [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 5],
  ];
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      animate={{ opacity: [0.25, 0.4, 0.25] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      {lines.map(([a, b], i) => (
        <line key={i} x1={points[a].x} y1={points[a].y} x2={points[b].x} y2={points[b].y}
          stroke="rgba(168,85,247,0.2)" strokeWidth="0.15" />
      ))}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i % 3 === 0 ? 0.6 : 0.35}
          fill="rgba(168,85,247,0.7)"
          style={{ animation: `twinkle ${2 + (i * 0.3)}s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────
// DOT GRID (preserved)
// ─────────────────────────────────────────────────
const DotGrid = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: 'radial-gradient(rgba(168,85,247,0.25) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
    }}
  />
);

// ─────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/3 border border-white/8 rounded-2xl">
      <div className="w-20 h-20 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-5">
        <FaRocket className="text-purple-400 text-3xl" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2">No Campaigns Yet</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        Start your first campaign and track its progress right here on your dashboard.
      </p>
      <Link
        href="/services/video-promotion"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-600 transition shadow-lg shadow-purple-500/20"
      >
        <FaRocket className="text-xs" /> Explore Services
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────
// MAIN DASHBOARD PAGE
// ─────────────────────────────────────────────────
const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [{ data: orderData }, servicesRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        serviceAPI.getAll(),
      ]);
      setOrders(orderData || []);
      setServices(servicesRes.data || []);
    } catch (err) {
      console.error('[dashboard] fetchData error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Derived lists
  const activeCampaigns = orders.filter((o) => o.status === 'processing' || o.status === 'pending');
  const pastCampaigns   = orders.filter((o) => o.status === 'completed'  || o.status === 'cancelled');

  // Stats config (preserved styling)
  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      max: Math.max(orders.length, 1),
      icon: <FaShoppingBag className="text-purple-300/20 text-7xl absolute -bottom-2 -right-2" />,
      ringColor: '#a855f7',
      border: 'border-purple-500/20',
      glow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]',
      bar: 'from-purple-500 to-indigo-500',
    },
    {
      label: 'Active Orders',
      value: activeCampaigns.length,
      max: Math.max(orders.length, 1),
      icon: <FaClock className="text-amber-300/15 text-7xl absolute -bottom-2 -right-2" />,
      ringColor: '#f59e0b',
      border: 'border-amber-500/20',
      glow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]',
      bar: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Completed',
      value: orders.filter((o) => o.status === 'completed').length,
      max: Math.max(orders.length, 1),
      icon: <FaCheckCircle className="text-emerald-300/15 text-7xl absolute -bottom-2 -right-2" />,
      ringColor: '#10b981',
      border: 'border-emerald-500/20',
      glow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]',
      bar: 'from-emerald-500 to-teal-500',
    },
  ];

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <CreatorLayout>
      <div data-testid="creator-dashboard" className="relative">

        {/* Background layers (preserved) */}
        <DotGrid />
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <Constellation />
        </div>
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute top-[30%] right-[-8%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }}
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
          <motion.div className="absolute bottom-[-5%] left-[30%] w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />
          <motion.div className="absolute top-[60%] left-[10%] w-[250px] h-[250px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
            animate={{ x: [0, -15, 0], y: [0, 25, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 8 }} />
        </div>

        {/* ══ PAGE HEADER ══ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 z-10"
        >
          <svg className="absolute -left-4 top-1/2 -translate-y-1/2 w-20 h-20 opacity-20" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="6 4" />
            <circle cx="40" cy="40" r="25" fill="none" stroke="#ec4899" strokeWidth="0.5" />
          </svg>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-sm pl-4">
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'} 👋
          </h1>
          <div className="pl-4 mt-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-gray-400 text-sm">Here's an overview of all your campaigns</span>
          </div>
        </motion.div>

        {/* ══ STAT CARDS ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative overflow-hidden bg-white/5 backdrop-blur-xl p-8 rounded-3xl border ${stat.border} shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${stat.glow} hover:-translate-y-1 group cursor-default`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.12, type: 'spring' }}
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.bar}`} />
              {stat.icon}
              <RadialRing value={stat.value} max={stat.max} color={stat.ringColor} size={72} strokeWidth={5} />
              <h3 className="text-gray-400 font-medium tracking-widest text-xs uppercase mb-3 relative z-10">{stat.label}</h3>
              <p className="text-6xl font-extrabold text-white tracking-tight relative z-10 mb-4">
                <CountUp end={stat.value} duration={2} separator="," />
              </p>
              <div className="relative z-10 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${stat.bar} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max((stat.value / Math.max(stats[0].value, 1)) * 100, stat.value > 0 ? 10 : 0)}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══ ACTIVE CAMPAIGNS ══ */}
        <div className="mb-16 relative z-10">
          <SectionHeader title="Active Campaigns" badge={activeCampaigns.length} />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : activeCampaigns.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeCampaigns.map((order, idx) => (
                <ActiveCampaignCard
                  key={order.id}
                  order={order}
                  index={idx}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ══ PAST CAMPAIGNS ══ */}
        {(loading || pastCampaigns.length > 0) && (
          <div className="mb-16 relative z-10">
            <SectionHeader title="Past Campaigns" badge={pastCampaigns.length} />

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/5 border border-white/8 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {pastCampaigns.map((order, idx) => (
                  <PastCampaignCard
                    key={order.id}
                    order={order}
                    index={idx}
                    onClick={() => setSelectedOrder(order)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ SERVICES GRID (preserved exactly) ══ */}
        <div className="mb-20 relative z-10">
          <SectionHeader title="Our Services" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
              >
                <Link
                  href={serviceRoutes[service.name] || `/services/${service.name.toLowerCase().replace(/ /g, '-')}`}
                  className="service-card-border block h-full bg-black/30 backdrop-blur-xl p-8 rounded-3xl transition-all duration-300 hover:bg-black/50 hover:-translate-y-2 group relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="relative mb-6 w-fit">
                    <svg className="icon-halo absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
                    </svg>
                    <div className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                      {serviceIcons[service.name]}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-purple-200 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 mb-8 leading-relaxed line-clamp-2 text-sm">{service.description}</p>
                  <div className="flex items-center text-purple-400 font-semibold group-hover:text-pink-400 transition-colors text-sm">
                    Order Now <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>

    </CreatorLayout>
  );
};

export default Dashboard;
