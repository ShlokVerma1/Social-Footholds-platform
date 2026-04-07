'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaRocket, FaSpinner, FaCalendarAlt, FaDollarSign, FaHeadset, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';

// ── Helpers ──────────────────────────────────────────────
function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}
function shortId(id = '') { return String(id).slice(0, 8); }
function daysSince(d) {
  if (!d) return 0;
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}

// ── Badge maps ────────────────────────────────────────────
const STATUS_BADGE = {
  pending:    'bg-amber-500/10 border-amber-500/30 text-amber-400',
  processing: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  completed:  'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  cancelled:  'bg-red-500/10 border-red-500/30 text-red-400',
};
const PAYMENT_BADGE = {
  paid:    'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  pending: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
};

// ── Circular Progress Ring ────────────────────────────────
function ProgressRing({ current, total }) {
  const pct = total > 1 ? (current / (total - 1)) * 100 : 100;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke="url(#pg)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-bold text-sm leading-none">{current + 1}</span>
        <span className="text-gray-500 text-[10px]">of {total}</span>
      </div>
    </div>
  );
}

// ── Expanded Milestone Tracker ────────────────────────────
function MilestoneTracker({ milestones, currentMilestone }) {
  const current = Number(currentMilestone ?? 0);
  return (
    <div className="w-full overflow-x-auto pb-1 pt-1">
      <div className="flex items-start min-w-max">
        {milestones.map((step, idx) => {
          const isDone   = idx < current;
          const isActive = idx === current;
          const isFuture = idx > current;
          const isLast   = idx === milestones.length - 1;
          return (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300
                  ${isDone   ? 'bg-purple-600 shadow-[0_0_14px_rgba(168,85,247,0.55)]' : ''}
                  ${isActive ? 'bg-purple-600/40 ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.65)]' : ''}
                  ${isFuture ? 'bg-white/5 border-2 border-white/15' : ''}
                `}>
                  <span className={isFuture ? 'opacity-25' : ''}>{step.icon}</span>
                </div>
                <span className={`text-[10px] text-center max-w-[72px] leading-tight font-medium
                  ${isDone ? 'text-purple-400' : isActive ? 'text-purple-300 font-semibold' : 'text-gray-600'}`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`h-0.5 w-10 mb-6 flex-shrink-0 transition-all duration-500
                  ${isDone ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 'bg-white/8'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Stat Chip ─────────────────────────────────────────────
function StatChip({ icon, label, value, accent = 'text-purple-400' }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 flex-1 min-w-[120px]">
      <div className={`text-base flex-shrink-0 ${accent}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-none mb-0.5">{label}</p>
        <p className="text-white font-bold text-sm">{value}</p>
      </div>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────
function OrderCard({ order, milestones, accentGradient }) {
  const current = Number(order.current_milestone ?? 0);
  const total   = milestones.length;
  const active  = milestones[current] ?? milestones[0];

  return (
    <motion.div
      className="service-card-border relative overflow-hidden backdrop-blur-xl rounded-3xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Accent top line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentGradient}`} />

      <div className="p-6 space-y-6">

        {/* ── Header row ── */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-white font-bold text-lg leading-tight">{order.service_name}</p>
            <p className="text-gray-600 text-xs font-mono mt-0.5">#{shortId(order.id)} · {fmtDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full border text-xs font-semibold capitalize ${STATUS_BADGE[order.status] || STATUS_BADGE.pending}`}>
              {order.status}
            </span>
            <span className={`px-3 py-1 rounded-full border text-xs font-semibold capitalize ${PAYMENT_BADGE[order.payment_status] || PAYMENT_BADGE.pending}`}>
              {order.payment_status}
            </span>
          </div>
        </div>

        {/* ── Stat chips row ── */}
        <div className="flex flex-wrap gap-2">
          <StatChip icon={<FaDollarSign />} label="Amount Paid" value={`$${Number(order.amount || 0).toFixed(2)}`} accent="text-purple-400" />
          <StatChip icon={<FaCalendarAlt />} label="Days Active" value={`${daysSince(order.created_at)}d`} accent="text-pink-400" />
          <StatChip icon={<FaChartLine />} label="Progress" value={`${Math.round(((current) / (total - 1)) * 100)}%`} accent="text-blue-400" />
        </div>

        {/* ── Progress ring + current stage ── */}
        <div className="flex items-center gap-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <ProgressRing current={current} total={total} />
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Current Stage</p>
            <p className="text-white font-bold text-base leading-tight">
              {active.icon} {active.label}
            </p>
            <p className="text-gray-600 text-xs mt-1">{current + 1} of {total} steps completed</p>
            {/* inline progress bar */}
            <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(current / (total - 1)) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* ── Milestone tracker ── */}
        <div className="bg-black/20 rounded-2xl p-4 border border-white/[0.05]">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-semibold">Campaign Journey</p>
          <MilestoneTracker milestones={milestones} currentMilestone={order.current_milestone} />
        </div>

        {/* ── Team message / activity ── */}
        {order.client_notes ? (
          <div className="bg-purple-600/10 border border-purple-500/25 rounded-2xl p-4">
            <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              💬 Message from our team
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{order.client_notes}</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="text-gray-400 text-sm">Your campaign is running — we'll post updates here as it progresses.</p>
          </div>
        )}

        {/* ── Quick actions ── */}
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href="mailto:team@socialfootholds.com"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:border-purple-500/40 hover:text-white text-xs font-semibold transition"
          >
            <FaEnvelope className="text-purple-400" /> Email Support
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:border-green-500/40 hover:text-white text-xs font-semibold transition"
          >
            <FaHeadset className="text-green-400" /> WhatsApp Us
          </a>
        </div>

      </div>
    </motion.div>
  );
}

// ── Main Export ───────────────────────────────────────────
/**
 * MonitorGrowthTab — shared across all service pages.
 * Props:
 *  - serviceName: string (must match DB `service_name` column)
 *  - milestones: Array<{ label: string, icon: string }>
 *  - accentGradient: Tailwind gradient string for the top accent line
 *  - onSwitchToNew: () => void
 */
export default function MonitorGrowthTab({ serviceName, milestones, accentGradient = 'from-purple-500 via-pink-500 to-transparent', onSwitchToNew }) {
  const { user } = useAuth();
  const supabase  = React.useMemo(() => createClient(), []);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('service_name', serviceName)
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    })();
  }, [user?.id, serviceName]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
      <FaSpinner className="animate-spin text-lg" /> Loading your campaigns…
    </div>
  );

  if (orders.length === 0) return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-5">
        <FaChartLine className="text-purple-400 text-3xl" />
      </div>
      <h3 className="text-white font-bold text-xl mb-2">No active campaigns yet</h3>
      <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
        Start your first campaign to track real-time progress, team updates, and milestones here.
      </p>
      <button
        onClick={onSwitchToNew}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition"
      >
        <FaRocket className="text-xs" /> Start your first campaign
      </button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Your Campaigns</h2>
          <p className="text-gray-500 text-xs mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          milestones={milestones}
          accentGradient={accentGradient}
        />
      ))}
    </div>
  );
}
