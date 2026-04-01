'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMusic } from 'react-icons/fa';
import CreatorLayout from '@/components/CreatorLayout';
import ServicePageShell from '@/components/service/ServicePageShell';
import StreamingStudioPanel from '@/components/service/panels/StreamingStudioPanel';

const MusicPromotion = () => {
  return (
    <CreatorLayout>
      {/* ServicePageShell: green/emerald accent for Music Promotion */}
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
        {/* ── COMING SOON CARD ─────────────────────── */}
        <motion.div
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-12 rounded-3xl text-center"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent" />

          {/* Micro-grid texture */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-3xl"
            style={{
              backgroundImage: 'linear-gradient(rgba(34,197,94,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,1) 1px,transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Animated emoji icon */}
          <motion.div
            className="mb-8 relative z-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600
              rounded-3xl flex items-center justify-center mx-auto
              shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              <span className="text-6xl">🎵</span>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Coming Soon!</h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed relative z-10 max-w-sm mx-auto">
            We're working hard to bring you the best music promotion services. This feature will be available soon!
          </p>

          {/* Notification CTA card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-900/40 to-emerald-900/30
            border border-green-500/30 p-6 rounded-2xl mb-8 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
            <h3 className="text-white font-semibold mb-2">Want to be notified when it launches?</h3>
            <p className="text-gray-400 text-sm mb-5">Contact us and we'll let you know as soon as this service is ready!</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <motion.a
                href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition font-semibold text-sm"
              >
                WhatsApp Us
              </motion.a>
              <motion.a
                href="mailto:team@socialfootholds.com"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition font-semibold text-sm"
              >
                Email Us
              </motion.a>
            </div>
          </div>

          <Link href="/dashboard"
            className="text-purple-400 hover:text-pink-400 transition-colors text-sm font-medium relative z-10">
            ← Explore Other Services
          </Link>
        </motion.div>
      </ServicePageShell>
    </CreatorLayout>
  );
};

export default MusicPromotion;
