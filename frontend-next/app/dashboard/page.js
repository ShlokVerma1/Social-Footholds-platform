'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CreatorLayout from '@/components/CreatorLayout';
import { orderAPI, serviceAPI } from '@/lib/api';
import {
  FaYoutube, FaMusic, FaSearch, FaFilm, FaMobileAlt, FaGlobe,
  FaArrowRight, FaCheckCircle, FaClock, FaTimesCircle,
  FaShoppingBag, FaStar, FaRocket
} from 'react-icons/fa';
import CountUp from 'react-countup';

// ─────────────────────────────────────────────────
// SECTION HEADER: Animated shimmer divider line
// ─────────────────────────────────────────────────
const SectionHeader = ({ title, href, hrefLabel }) => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-4 flex-1">
      <h2 className="text-3xl font-bold text-white whitespace-nowrap">{title}</h2>
      {/* Shimmer sweep line */}
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
// RADIAL ARC RING: SVG animated stats ring
// ─────────────────────────────────────────────────
const RadialRing = ({ value, max, color, size = 80, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - pct);

  return (
    <svg width={size} height={size} className="absolute top-4 right-4 opacity-70" style={{ transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth}
      />
      {/* Animated fill arc */}
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
// CONSTELLATION: Drifting SVG star-map background
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
      {/* Constellation lines */}
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a].x} y1={points[a].y}
          x2={points[b].x} y2={points[b].y}
          stroke="rgba(168,85,247,0.2)" strokeWidth="0.15"
        />
      ))}
      {/* Constellation dots */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y} r={i % 3 === 0 ? 0.6 : 0.35}
          fill="rgba(168,85,247,0.7)"
          style={{ animation: `twinkle ${2 + (i * 0.3)}s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────
// DOT GRID: Animated pulsing dot floor grid
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
// MAIN DASHBOARD PAGE
// ─────────────────────────────────────────────────
const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, servicesRes] = await Promise.all([
        orderAPI.getAll(),
        serviceAPI.getAll()
      ]);
      setOrders(ordersRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Stat cards config — each has a unique accent colour + ring
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
      value: orders.filter(o => o.status === 'processing').length,
      max: Math.max(orders.length, 1),
      icon: <FaClock className="text-amber-300/15 text-7xl absolute -bottom-2 -right-2" />,
      ringColor: '#f59e0b',
      border: 'border-amber-500/20',
      glow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]',
      bar: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Completed',
      value: orders.filter(o => o.status === 'completed').length,
      max: Math.max(orders.length, 1),
      icon: <FaCheckCircle className="text-emerald-300/15 text-7xl absolute -bottom-2 -right-2" />,
      ringColor: '#10b981',
      border: 'border-emerald-500/20',
      glow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]',
      bar: 'from-emerald-500 to-teal-500',
    },
  ];

  if (loading) {
    return (
      <CreatorLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          {/* Premium loading state */}
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-purple-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaRocket className="text-purple-400 text-lg" />
            </div>
          </div>
          <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse">Loading your dashboard…</p>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div data-testid="creator-dashboard" className="relative">

        {/* ══════════════════════════════════════════ */}
        {/* LAYER 1: BACKGROUND GRAPHICS SYSTEM       */}
        {/* ══════════════════════════════════════════ */}

        {/* Dot grid floor */}
        <DotGrid />

        {/* Constellation star map */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <Constellation />
        </div>

        {/* Multi-orb aurora depth field */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[30%] right-[-8%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }}
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          />
          <motion.div
            className="absolute bottom-[-5%] left-[30%] w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
          <motion.div
            className="absolute top-[60%] left-[10%] w-[250px] h-[250px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
            animate={{ x: [0, -15, 0], y: [0, 25, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          />
          <motion.div
            className="absolute top-[10%] right-[25%] w-[200px] h-[200px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        {/* ══════════════════════════════════════════ */}
        {/* PAGE HEADER                               */}
        {/* ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 z-10"
        >
          {/* Decorative header SVG ring behind the title */}
          <svg className="absolute -left-4 top-1/2 -translate-y-1/2 w-20 h-20 opacity-20" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="6 4" />
            <circle cx="40" cy="40" r="25" fill="none" stroke="#ec4899" strokeWidth="0.5" />
          </svg>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-sm pl-4">
            Creator Dashboard
          </h1>
          <div className="pl-4 mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-gray-400 text-sm">Live</span>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════ */}
        {/* STAT CARDS WITH RADIAL RINGS              */}
        {/* ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative overflow-hidden bg-white/5 backdrop-blur-xl p-8 rounded-3xl border ${stat.border} shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${stat.glow} hover:-translate-y-1 group cursor-default`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.12, type: 'spring' }}
            >
              {/* Top gradient accent bar */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.bar}`} />

              {/* Ghost watermark icon */}
              {stat.icon}

              {/* SVG Radial Arc Ring */}
              <RadialRing
                value={stat.value}
                max={stat.max}
                color={stat.ringColor}
                size={72}
                strokeWidth={5}
              />

              {/* Content */}
              <h3 className="text-gray-400 font-medium tracking-widest text-xs uppercase mb-3 relative z-10">
                {stat.label}
              </h3>
              <p className="text-6xl font-extrabold text-white tracking-tight relative z-10 mb-4">
                <CountUp end={stat.value} duration={2} separator="," />
              </p>

              {/* Proportional fill bar at bottom */}
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

        {/* ══════════════════════════════════════════ */}
        {/* SERVICE CARDS: Rotating border + halo     */}
        {/* ══════════════════════════════════════════ */}
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
                  {/* Subtle inner micro-grid */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Icon with halo ring */}
                  <div className="relative mb-6 w-fit">
                    {/* Halo SVG ring pulsating behind icon */}
                    <svg
                      className="icon-halo absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none"
                      viewBox="0 0 56 56"
                    >
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
                    </svg>
                    <div className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                      {serviceIcons[service.name]}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-purple-200 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 mb-8 leading-relaxed line-clamp-2 text-sm">
                    {service.description}
                  </p>
                  <div className="flex items-center text-purple-400 font-semibold group-hover:text-pink-400 transition-colors text-sm">
                    Order Now <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════ */}
        {/* ORDERS: Neon vertical timeline            */}
        {/* ══════════════════════════════════════════ */}
        <div className="relative z-10 pb-12">
          <SectionHeader title="Recent Orders" href="/orders" hrefLabel="View All" />

          {orders.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center text-gray-400 shadow-inner">
              <FaRocket className="text-4xl mx-auto mb-4 text-purple-500/50" />
              <p className="text-lg">No orders yet. Start by ordering a service!</p>
            </div>
          ) : (
            <div className="relative">
              {/* The vertical neon timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/80 via-pink-500/40 to-transparent" />

              <div className="space-y-4 pl-14">
                {orders.slice(0, 5).map((order, idx) => {
                  const isProcessing = order.status === 'processing';
                  const isCompleted  = order.status === 'completed';

                  const nodeColor = isProcessing
                    ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] text-amber-400'
                    : isCompleted
                    ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] text-emerald-400'
                    : 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)] text-red-400';

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline node */}
                      <div className="absolute -left-[44px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className={`relative w-4 h-4 rounded-full ${nodeColor.split(' ').slice(0,3).join(' ')}`}>
                          {/* Radar pulse ring for processing orders */}
                          {isProcessing && (
                            <div className={`radar-pulse absolute inset-0 rounded-full ${nodeColor.split(' ')[3]} ${nodeColor.split(' ')[4]}`} />
                          )}
                        </div>
                      </div>

                      {/* Order card */}
                      <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/8 hover:border-purple-500/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:-translate-y-0.5 relative overflow-hidden">
                        {/* Left accent line on hover */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 group-hover:text-purple-200 transition-colors">
                              {order.service_name}
                            </h3>
                            <p className="text-gray-500 text-xs mb-3 font-mono bg-black/20 px-2 py-1 rounded w-fit">
                              Order #{order.id.substring(0, 8)}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                isProcessing ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                                : isCompleted ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'
                              }`} />
                              <span className="text-gray-300 text-sm font-semibold capitalize tracking-wide">{order.status}</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-white/10 sm:border-0">
                            <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
                              ${order.amount}
                            </p>
                            <p className="text-gray-500 text-sm tracking-wide">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </CreatorLayout>
  );
};

export default Dashboard;
