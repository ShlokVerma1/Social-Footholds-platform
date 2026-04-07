'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMusic, FaRocket, FaChartLine } from 'react-icons/fa';
import CreatorLayout from '@/components/CreatorLayout';
import ServicePageShell from '@/components/service/ServicePageShell';
import StreamingStudioPanel from '@/components/service/panels/StreamingStudioPanel';
import MonitorGrowthTab from '@/components/service/MonitorGrowthTab';

const SERVICE_NAME = 'Music Promotion';

const MILESTONES = [
  { label: 'Order Received', icon: '📋' },
  { label: 'Track Review', icon: '🎵' },
  { label: 'Playlist Outreach', icon: '📢' },
  { label: 'Placement Confirmed', icon: '🎯' },
  { label: 'Streams Growing', icon: '📈' },
  { label: 'Completed', icon: '✅' },
];

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



const MusicPromotion = () => {
  const [activeTab, setActiveTab] = useState('new');

  return (
    <CreatorLayout>
      <ServicePageShell
        title="Music Promotion"
        description="Promote your music on Spotify and Apple Music to gain more streams and followers"
        accentIcon={<FaMusic />}
        iconBgFrom="from-green-500" iconBgTo="to-emerald-600"
        orb1="rgba(34,197,94,0.15)" orb2="rgba(16,185,129,0.1)" orb3="rgba(34,197,94,0.06)"
        polygonStroke="#22c55e"
        badge="Coming Soon" badgeDot="bg-amber-400"
        rightPanel={<StreamingStudioPanel />}
      >
        {/* ── TAB BAR ── */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200
              ${activeTab === 'new' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            data-testid="tab-new-campaign"
          >
            <FaRocket className="text-xs" /> New Campaign
          </button>
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200
              ${activeTab === 'monitor' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            data-testid="tab-monitor-growth"
          >
            <FaChartLine className="text-xs" /> Monitor Growth
          </button>
        </div>

        {activeTab === 'monitor' ? (
          <MonitorGrowthTab
            serviceName={SERVICE_NAME}
            milestones={MILESTONES}
            accentGradient="from-green-500 via-emerald-500 to-transparent"
            onSwitchToNew={() => setActiveTab('new')}
          />
        ) : (
          <motion.div
            className="service-card-border relative overflow-hidden backdrop-blur-xl p-12 rounded-3xl text-center"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent" />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-3xl"
              style={{
                backgroundImage: 'linear-gradient(rgba(34,197,94,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,1) 1px,transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <motion.div className="mb-8 relative z-10" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                <span className="text-6xl">🎵</span>
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Coming Soon!</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed relative z-10 max-w-sm mx-auto">
              We're working hard to bring you the best music promotion services. This feature will be available soon!
            </p>
            <div className="relative overflow-hidden bg-gradient-to-r from-green-900/40 to-emerald-900/30 border border-green-500/30 p-6 rounded-2xl mb-8 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
              <h3 className="text-white font-semibold mb-2">Want to be notified when it launches?</h3>
              <p className="text-gray-400 text-sm mb-5">Contact us and we'll let you know as soon as this service is ready!</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <motion.a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition font-semibold text-sm">
                  WhatsApp Us
                </motion.a>
                <motion.a href="mailto:team@socialfootholds.com"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition font-semibold text-sm">
                  Email Us
                </motion.a>
              </div>
            </div>
            <Link href="/dashboard" className="text-purple-400 hover:text-pink-400 transition-colors text-sm font-medium relative z-10">
              ← Explore Other Services
            </Link>
          </motion.div>
        )}
      </ServicePageShell>
    </CreatorLayout>
  );
};

export default MusicPromotion;
