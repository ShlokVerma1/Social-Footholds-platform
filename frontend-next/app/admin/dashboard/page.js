'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { FaUsers, FaShoppingBag, FaEnvelope, FaDollarSign, FaArrowUp, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import CountUp from 'react-countup';

// ─────────────────────────────────────────────────
// ADMIN DOT GRID: Subtle red-tinted dot backdrop
// ─────────────────────────────────────────────────
const AdminDotGrid = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-30"
    style={{
      backgroundImage: 'radial-gradient(rgba(239,68,68,0.2) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      maskImage: 'radial-gradient(ellipse 70% 50% at 50% 30%, black 30%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 30%, black 30%, transparent 100%)',
    }}
  />
);

// ─────────────────────────────────────────────────
// RADIAL ARC: SVG progress ring for stat cards
// ─────────────────────────────────────────────────
const RadialArc = ({ value, max, color, size = 64, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - pct);

  return (
    <svg width={size} height={size} className="absolute top-3 right-3 opacity-60" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.4 }}
      />
    </svg>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally { setLoading(false); }
  };

  if (loading || !stats) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        {loading ? (
          <>
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-red-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaShieldAlt className="text-red-400 text-lg" />
              </div>
            </div>
            <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse">Loading admin data…</p>
          </>
        ) : (
          <div className="text-red-400">Error loading dashboard statistics. Please refresh or verify permissions.</div>
        )}
      </div>
    </AdminLayout>
  );

  // Stat cards configuration — each with unique accent colour + ring
  const statCards = [
    {
      label: 'Total Users',
      value: stats.total_users,
      max: Math.max(stats.total_users, 1),
      icon: <FaUsers className="text-blue-400/20 text-6xl absolute -bottom-1 -right-1" />,
      mainIcon: <FaUsers className="text-3xl text-blue-400" />,
      ringColor: '#3b82f6',
      border: 'border-blue-500/20',
      glow: 'hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]',
      bar: 'from-blue-500 to-cyan-500',
      extra: (
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
          <FaArrowUp className="text-[9px]" /><span>+{stats.recent_registrations}</span>
        </div>
      ),
      subtext: `${stats.recent_registrations} new this week`,
      testId: 'total-users',
    },
    {
      label: 'Total Orders',
      value: stats.total_orders,
      max: Math.max(stats.total_orders, 1),
      icon: <FaShoppingBag className="text-purple-400/15 text-6xl absolute -bottom-1 -right-1" />,
      mainIcon: <FaShoppingBag className="text-3xl text-purple-400" />,
      ringColor: '#a855f7',
      border: 'border-purple-500/20',
      glow: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.2)]',
      bar: 'from-purple-500 to-violet-500',
      extra: null,
      subtext: null,
      testId: 'total-orders',
    },
    {
      label: 'Pending Enquiries',
      value: stats.pending_enquiries,
      max: Math.max(stats.pending_enquiries + 5, 1),
      icon: <FaEnvelope className="text-pink-400/15 text-6xl absolute -bottom-1 -right-1" />,
      mainIcon: <FaEnvelope className="text-3xl text-pink-400" />,
      ringColor: '#ec4899',
      border: 'border-pink-500/20',
      glow: 'hover:shadow-[0_0_35px_rgba(236,72,153,0.2)]',
      bar: 'from-pink-500 to-rose-500',
      extra: stats.pending_enquiries > 0 ? (
        <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-bold animate-pulse">
          {stats.pending_enquiries}
        </span>
      ) : null,
      subtext: null,
      testId: 'pending-enquiries',
    },
    {
      label: 'Total Revenue',
      value: stats.total_revenue,
      max: Math.max(stats.total_revenue, 1),
      icon: <FaDollarSign className="text-emerald-400/15 text-6xl absolute -bottom-1 -right-1" />,
      mainIcon: <FaDollarSign className="text-3xl text-emerald-400" />,
      ringColor: '#10b981',
      border: 'border-emerald-500/20',
      glow: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]',
      bar: 'from-emerald-500 to-teal-500',
      extra: null,
      subtext: null,
      testId: 'total-revenue',
      isCurrency: true,
    },
  ];

  // Platform overview rows
  const platformRows = [
    { label: 'Active Platform', value: '✓ Online', valueClass: 'text-emerald-400' },
    { label: 'Services Available', value: '6', valueClass: 'text-white' },
    { label: 'Global Creators', value: '25,000+', valueClass: 'text-white' },
    { label: 'Audience Reach', value: '1B+', valueClass: 'text-white' },
  ];

  // Quick action links
  const quickActions = [
    { href: '/admin/users', emoji: '👥', label: 'View All Users', color: 'from-blue-600/20 to-blue-700/10', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-400/50' },
    { href: '/admin/orders', emoji: '📦', label: 'Manage Orders', color: 'from-purple-600/20 to-purple-700/10', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-400/50' },
    { href: '/admin/enquiries', emoji: '✉️', label: 'Review Enquiries', color: 'from-pink-600/20 to-pink-700/10', border: 'border-pink-500/30', hoverBorder: 'hover:border-pink-400/50' },
    { href: '/admin/blogs', emoji: '📝', label: 'Create Blog Post', color: 'from-orange-600/20 to-orange-700/10', border: 'border-orange-500/30', hoverBorder: 'hover:border-orange-400/50' },
  ];

  return (
    <AdminLayout>
      <div data-testid="admin-dashboard" className="relative">

        {/* ── BACKGROUND LAYER ──────────────────── */}
        <AdminDotGrid />

        {/* Aurora orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            className="absolute top-[-8%] right-[-5%] w-[450px] h-[450px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)' }}
            animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)' }}
            animate={{ x: [0, 20, 0], y: [0, -18, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          />
          <motion.div
            className="absolute top-[40%] left-[40%] w-[280px] h-[280px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          />
        </div>

        {/* ── PAGE HEADER ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 z-10"
        >
          {/* Decorative SVG ring behind title */}
          <svg className="absolute -left-4 top-1/2 -translate-y-1/2 w-20 h-20 opacity-20" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 4" />
            <circle cx="40" cy="40" r="25" fill="none" stroke="#f97316" strokeWidth="0.5" />
          </svg>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent drop-shadow-sm pl-4">
            Admin Dashboard
          </h1>
          <div className="pl-4 mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-gray-400 text-sm">System Online</span>
          </div>
        </motion.div>

        {/* ── STAT CARDS ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={`relative overflow-hidden bg-white/5 backdrop-blur-xl p-7 rounded-3xl border ${card.border} shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${card.glow} hover:-translate-y-1 group cursor-default`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1, type: 'spring' }}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.bar}`} />

              {/* Ghost watermark icon */}
              {card.icon}

              {/* SVG Radial Arc */}
              <RadialArc value={card.value} max={card.max} color={card.ringColor} />

              {/* Header row: icon + extra badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                {card.mainIcon}
                {card.extra}
              </div>

              {/* Label */}
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 relative z-10">
                {card.label}
              </p>

              {/* Value */}
              <p className="text-4xl font-extrabold text-white tracking-tight relative z-10 mb-3" data-testid={card.testId}>
                {card.isCurrency ? '$' : ''}
                <CountUp
                  end={card.value}
                  duration={2}
                  separator=","
                  decimals={card.isCurrency ? 2 : 0}
                />
              </p>

              {/* Subtext */}
              {card.subtext && (
                <p className="text-gray-500 text-xs relative z-10">{card.subtext}</p>
              )}

              {/* Fill bar */}
              <div className="relative z-10 h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                <motion.div
                  className={`h-full bg-gradient-to-r ${card.bar} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((card.value / card.max) * 100, 100)}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── BOTTOM TWO-COLUMN SECTION ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">

          {/* Platform Overview */}
          <motion.div
            className="service-card-border relative overflow-hidden backdrop-blur-xl p-7 rounded-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-transparent" />
            {/* Micro-grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-3xl"
              style={{
                backgroundImage: 'linear-gradient(rgba(239,68,68,1) 1px,transparent 1px),linear-gradient(90deg,rgba(239,68,68,1) 1px,transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <h2 className="text-2xl font-bold text-white mb-5 relative z-10">Platform Overview</h2>
            <div className="space-y-3 relative z-10">
              {platformRows.map((row, i) => (
                <motion.div
                  key={row.label}
                  className="flex justify-between items-center p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-red-500/20 transition-all duration-200"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.07 }}
                >
                  <span className="text-gray-400 text-sm">{row.label}</span>
                  <span className={`${row.valueClass} font-semibold text-sm`}>{row.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="service-card-border relative overflow-hidden backdrop-blur-xl p-7 rounded-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-3xl"
              style={{
                backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <h2 className="text-2xl font-bold text-white mb-5 relative z-10">Quick Actions</h2>
            <div className="space-y-3 relative z-10">
              {quickActions.map((action, i) => (
                <motion.a
                  key={action.href}
                  href={action.href}
                  className={`group flex items-center justify-between p-4 bg-gradient-to-r ${action.color} border ${action.border} ${action.hoverBorder} rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.07 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-medium text-sm flex items-center gap-2.5">
                    <span className="text-lg">{action.emoji}</span>
                    {action.label}
                  </span>
                  <FaArrowRight className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all text-xs" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
