'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaYoutube, FaCheckCircle } from 'react-icons/fa';
import CreatorLayout from '@/components/CreatorLayout';
import ServicePageShell from '@/components/service/ServicePageShell';
import VideoDashboardPanel from '@/components/service/panels/VideoDashboardPanel';
import { serviceAPI, pricingAPI, orderAPI } from '@/lib/api';

const VideoPromotion = () => {
  const router = useRouter();
  const [service, setService] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [targetViews, setTargetViews] = useState(10000);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchService(); }, []);
  useEffect(() => { if (service && targetViews > 0) calculatePrice(); }, [targetViews, service]);

  const fetchService = async () => {
    try {
      const response = await serviceAPI.getAll();
      const videoService = response.data.find(s => s.name === 'Video Promotion');
      setService(videoService);
    } catch (error) { console.error('Error fetching service:', error); }
  };

  const calculatePrice = async () => {
    try {
      const response = await pricingAPI.calculate({ service_id: service.id, details: { views: targetViews } });
      setCalculatedPrice(response.data.amount);
    } catch (error) { console.error('Error calculating price:', error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await orderAPI.create({
        service_id: service.id,
        details: { video_url: videoUrl, target_views: targetViews }
      });
      router.push(`/payment/${response.data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally { setLoading(false); }
  };

  if (!service) return (
    <CreatorLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    </CreatorLayout>
  );

  // ── Why-choose bullets (all exact original text preserved) ──
  const bullets = [
    <><strong>Organic Growth:</strong> 100% real viewers from targeted demographics - no bots or fake engagement</>,
    <><strong>Geography Targeting:</strong> Reach audiences in specific countries and regions that match your content</>,
    <><strong>Niche-Specific:</strong> Your video reaches people genuinely interested in your content category</>,
    <><strong>Fast Results:</strong> Start seeing views within 24-48 hours of campaign launch</>,
    <><strong>Algorithm Boost:</strong> Increased views help YouTube's algorithm recommend your content to more people</>,
  ];

  return (
    <CreatorLayout>
      {/* ServicePageShell: red/orange accent for Video Promotion */}
      <ServicePageShell
        title="Video Promotion"
        description={service.description}
        accentIcon={<FaYoutube />}
        iconBgFrom="from-red-500" iconBgTo="to-orange-500"
        orb1="rgba(239,68,68,0.15)" orb2="rgba(251,146,60,0.1)" orb3="rgba(168,85,247,0.08)"
        polygonStroke="#ef4444"
        badge="Live Service" badgeDot="bg-emerald-400"
        rightPanel={<VideoDashboardPanel />}
      >
        {/* ── WHY-CHOOSE SECTION ────────────────────── */}
        <motion.div
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-6 rounded-3xl mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-transparent" />
          <h2 className="text-2xl font-bold text-white mb-5">Why Choose Video Promotion?</h2>
          <ul className="space-y-3">
            {bullets.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
                className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.06]
                  hover:border-red-500/20 rounded-xl p-3 transition-all duration-200"
              >
                {/* Numbered badge */}
                <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30
                  flex items-center justify-center flex-shrink-0 text-xs font-bold text-red-300">
                  {i + 1}
                </div>
                <span className="text-gray-300 leading-relaxed text-sm">{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ── ORDER FORM ────────────────────────────── */}
        <motion.div
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-8 rounded-3xl"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {/* Micro-grid inside form card */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-3xl"
            style={{
              backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Video URL */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Video URL</label>
              <input type="url" required value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                data-testid="video-url-input"
              />
            </div>

            {/* Target Views */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Target Views</label>
              <input type="number" required min="1000" step="1000" value={targetViews}
                onChange={(e) => setTargetViews(parseInt(e.target.value))}
                className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                data-testid="target-views-input"
              />
              <p className="text-gray-500 text-xs mt-2">Minimum 1,000 views</p>
            </div>

            {/* Price display — premium glow card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-900/40 to-orange-900/30
              border border-red-500/30 p-6 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.1)]">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-300 mb-1 text-sm">Estimated Cost</p>
                  <p className="text-xs text-gray-500">{targetViews.toLocaleString()} views</p>
                </div>
                <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
                  data-testid="calculated-price">
                  ${calculatedPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Features list — glass chip rows */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">What's Included:</h3>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.05]
                    rounded-xl p-3 hover:border-green-500/20 transition-colors duration-200">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCheckCircle className="text-green-400 text-xs" />
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit button */}
            <motion.button type="submit" disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-shimmer w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white
                px-8 py-4 rounded-xl text-lg font-semibold
                hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition disabled:opacity-50"
              data-testid="submit-order-button"
            >
              {loading ? 'Creating Order...' : 'Proceed to Payment'}
            </motion.button>
          </form>
        </motion.div>
      </ServicePageShell>
    </CreatorLayout>
  );
};

export default VideoPromotion;
