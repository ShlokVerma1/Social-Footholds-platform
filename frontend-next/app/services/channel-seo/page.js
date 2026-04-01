'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaCheckCircle } from 'react-icons/fa';
import CreatorLayout from '@/components/CreatorLayout';
import ServicePageShell from '@/components/service/ServicePageShell';
import SEOCommandPanel from '@/components/service/panels/SEOCommandPanel';
import { serviceAPI, pricingAPI, orderAPI } from '@/lib/api';

const ChannelSEO = () => {
  const router = useRouter();
  const [service, setService] = useState(null);
  const [channelUrl, setChannelUrl] = useState('');
  const [duration, setDuration] = useState(3);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchService(); }, []);
  useEffect(() => { if (service && duration > 0) calculatePrice(); }, [duration, service]);

  const fetchService = async () => {
    try {
      const response = await serviceAPI.getAll();
      const seoService = response.data.find(s => s.name === 'Channel SEO Optimization');
      setService(seoService);
    } catch (error) { console.error('Error fetching service:', error); }
  };

  const calculatePrice = async () => {
    try {
      // Fixed pricing for each duration
      const pricing = { 3: 599, 6: 799, 9: 1199, 12: 1499 };
      setCalculatedPrice(pricing[duration] || 599);
    } catch (error) { console.error('Error calculating price:', error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await orderAPI.create({
        service_id: service.id,
        details: { channel_url: channelUrl, duration: duration }
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
    <><strong>Complete Channel Audit:</strong> Deep analysis of your current SEO performance and opportunities</>,
    <><strong>Watch Time Growth:</strong> Proven strategies to increase viewer retention and watch time</>,
    <><strong>Subscriber Acceleration:</strong> Tactics that convert viewers into loyal subscribers</>,
    <><strong>Monetization Ready:</strong> Help you meet and exceed YouTube Partner Program requirements</>,
    <><strong>Ongoing Support:</strong> Monthly consultations and optimization throughout your subscription</>,
  ];

  return (
    <CreatorLayout>
      {/* ServicePageShell: blue/indigo accent for Channel SEO */}
      <ServicePageShell
        title="Channel SEO Optimization"
        description={service.description}
        accentIcon={<FaSearch />}
        iconBgFrom="from-blue-500" iconBgTo="to-indigo-600"
        orb1="rgba(59,130,246,0.18)" orb2="rgba(99,102,241,0.12)" orb3="rgba(139,92,246,0.08)"
        polygonStroke="#3b82f6"
        badge="Live Service" badgeDot="bg-emerald-400"
        rightPanel={<SEOCommandPanel />}
      >
        {/* ── WHY-CHOOSE SECTION ────────────────────── */}
        <motion.div
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-6 rounded-3xl mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent" />
          <h2 className="text-2xl font-bold text-white mb-5">Transform Your Channel with SEO</h2>
          <ul className="space-y-3">
            {bullets.map((text, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
                className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.06]
                  hover:border-blue-500/20 rounded-xl p-3 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30
                  flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-300">
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
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-3xl"
            style={{
              backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,1) 1px,transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

            {/* Channel URL */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">YouTube Channel URL</label>
              <input type="url" required value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                data-testid="channel-url-input"
              />
            </div>

            {/* Duration picker */}
            <div>
              <label className="block text-gray-300 mb-4 text-sm font-medium">Subscription Duration</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[3, 6, 9, 12].map((months) => (
                  <motion.button
                    key={months}
                    type="button"
                    onClick={() => setDuration(months)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      duration === months
                        ? 'border-blue-500 bg-blue-600/25 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                        : 'border-white/10 bg-white/5 hover:border-blue-500/40'
                    }`}
                    data-testid={`duration-${months}-button`}
                  >
                    <p className="text-2xl font-bold text-white">{months}</p>
                    <p className="text-gray-400 text-xs mt-1">months</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 to-indigo-900/30
              border border-blue-500/30 p-6 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.1)]">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-300 mb-1 text-sm">Total Cost</p>
                  <p className="text-xs text-gray-500">{duration} months subscription</p>
                </div>
                <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"
                  data-testid="calculated-price">
                  ${calculatedPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Features list */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">What's Included:</h3>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.05]
                    rounded-xl p-3 hover:border-green-500/20 transition-colors duration-200">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCheckCircle className="text-green-400 text-xs" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
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

export default ChannelSEO;
