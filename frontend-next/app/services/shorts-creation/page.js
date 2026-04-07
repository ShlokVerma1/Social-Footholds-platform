'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMobileAlt, FaCheckCircle, FaRocket, FaChartLine } from 'react-icons/fa';
import CreatorLayout from '@/components/CreatorLayout';
import ServicePageShell from '@/components/service/ServicePageShell';
import PhonePreviewPanel from '@/components/service/panels/PhonePreviewPanel';
import MonitorGrowthTab from '@/components/service/MonitorGrowthTab';
import { serviceAPI, orderAPI } from '@/lib/api';

const SERVICE_NAME = 'Shorts Creation';

const MILESTONES = [
  { label: 'Order Received', icon: '📋' },
  { label: 'Content Review', icon: '🔍' },
  { label: 'Editing In Progress', icon: '✂️' },
  { label: 'Draft Sent', icon: '📤' },
  { label: 'Revisions', icon: '🔄' },
  { label: 'Final Delivered', icon: '✅' },
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



const ShortsCreation = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('new');
  const [service, setService] = useState(null);
  const [longVideoUrl, setLongVideoUrl] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('4');
  const [contentIdeas, setContentIdeas] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const packages = {
    '4':  { shorts: 4,  price: 99  },
    '10': { shorts: 10, price: 199 },
    '20': { shorts: 20, price: 399 },
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await serviceAPI.getAll();
        setService(response.data.find(s => s.name === 'Shorts Creation'));
      } catch (error) { console.error('Error fetching service:', error); }
    };
    fetchService();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await orderAPI.create({
        service_id: service.id,
        details: { long_video_url: longVideoUrl, package: selectedPackage, number_of_shorts: packages[selectedPackage].shorts, content_ideas: contentIdeas }
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

  return (
    <CreatorLayout>
      <ServicePageShell
        title="Shorts Creation"
        description={service.description}
        accentIcon={<FaMobileAlt />}
        iconBgFrom="from-pink-500" iconBgTo="to-rose-600"
        orb1="rgba(236,72,153,0.18)" orb2="rgba(251,113,133,0.12)" orb3="rgba(244,114,182,0.08)"
        polygonStroke="#ec4899"
        badge="Live Service" badgeDot="bg-emerald-400"
        rightPanel={<PhonePreviewPanel />}
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
            accentGradient="from-pink-500 via-rose-500 to-transparent"
            onSwitchToNew={() => setActiveTab('new')}
          />
        ) : (
          <motion.div
            className="service-card-border relative overflow-hidden backdrop-blur-xl p-8 rounded-3xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-3xl"
              style={{
                backgroundImage: 'linear-gradient(rgba(236,72,153,1) 1px,transparent 1px),linear-gradient(90deg,rgba(236,72,153,1) 1px,transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-gray-300 mb-4 text-lg font-semibold">Choose Your Package</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(packages).map(([key, pkg]) => (
                    <motion.button key={key} type="button"
                      onClick={() => setSelectedPackage(key)}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                        selectedPackage === key
                          ? 'border-pink-500 bg-pink-600/20 shadow-[0_0_25px_rgba(236,72,153,0.25)]'
                          : 'border-white/10 bg-white/5 hover:border-pink-500/40'
                      }`}
                      data-testid={`package-${key}-button`}
                    >
                      {selectedPackage === key && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500" />
                      )}
                      <div className="text-center">
                        <p className="text-3xl font-bold text-white mb-2">{pkg.shorts}</p>
                        <p className="text-gray-400 text-sm mb-3">Shorts</p>
                        <p className="text-2xl font-bold text-pink-400">${pkg.price}</p>
                        {selectedPackage === key && (
                          <p className="text-emerald-400 text-xs mt-2 font-semibold">✓ Selected</p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                <motion.button type="button"
                  onClick={() => setShowContactModal(true)}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 p-4 border-2 border-pink-500/30 bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/50 rounded-xl transition text-pink-400 font-semibold text-sm"
                >
                  Need more shorts? Contact us for custom packages →
                </motion.button>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Long-Form Video URL</label>
                <input type="url" required value={longVideoUrl}
                  onChange={(e) => setLongVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or file link"
                  className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                  data-testid="long-video-url-input"
                />
                <p className="text-gray-500 text-xs mt-1">Provide your YouTube video link or upload link (Google Drive, Dropbox)</p>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Content Ideas & Preferences (Optional)
                </label>
                <textarea rows={4} value={contentIdeas}
                  onChange={(e) => setContentIdeas(e.target.value)}
                  placeholder="Tell us about specific moments, themes, or styles you'd like for your shorts..."
                  className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none resize-none"
                  data-testid="content-ideas-input"
                />
              </div>
              <div className="relative overflow-hidden bg-gradient-to-r from-pink-900/40 to-rose-900/30 border border-pink-500/30 p-6 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.1)]">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300 mb-1 text-sm">Selected Package</p>
                    <p className="text-xs text-gray-500">{packages[selectedPackage].shorts} professionally edited shorts</p>
                  </div>
                  <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400" data-testid="package-price">
                    ${packages[selectedPackage].price}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm">What's Included:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 hover:border-green-500/20 transition-colors duration-200">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheckCircle className="text-green-400 text-xs" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <motion.button type="submit" disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="btn-shimmer w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition disabled:opacity-50"
                data-testid="submit-order-button"
              >
                {loading ? 'Creating Order...' : 'Proceed to Payment'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </ServicePageShell>

      {/* ── CONTACT MODAL (unchanged) ── */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-purple-900 p-8 rounded-2xl border border-purple-500 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Need More Shorts?</h3>
              <p className="text-gray-300 mb-6">Contact us for custom packages tailored to your needs!</p>
              <div className="space-y-3">
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition w-full">
                  WhatsApp Us
                </a>
                <a href="mailto:team@socialfootholds.com"
                  className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition w-full">
                  Email Us
                </a>
              </div>
              <button onClick={() => setShowContactModal(false)}
                className="mt-4 w-full text-gray-400 hover:text-white transition text-sm">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CreatorLayout>
  );
};

export default ShortsCreation;
