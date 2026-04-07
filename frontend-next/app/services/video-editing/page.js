'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaFilm, FaCheckCircle, FaRocket, FaChartLine } from 'react-icons/fa';
import CreatorLayout from '@/components/CreatorLayout';
import ServicePageShell from '@/components/service/ServicePageShell';
import EditSuitePanel from '@/components/service/panels/EditSuitePanel';
import MonitorGrowthTab from '@/components/service/MonitorGrowthTab';
import { serviceAPI, orderAPI } from '@/lib/api';

const SERVICE_NAME = 'Video Editing';

const MILESTONES = [
  { label: 'Order Received', icon: '📋' },
  { label: 'Brief Review', icon: '📄' },
  { label: 'Editing In Progress', icon: '✂️' },
  { label: 'First Draft Sent', icon: '📤' },
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



const VideoEditing = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('new');
  const [service, setService] = useState(null);
  const [rawVideoUrl, setRawVideoUrl] = useState('');
  const [editingRequirements, setEditingRequirements] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await serviceAPI.getAll();
        setService(response.data.find(s => s.name === 'Video Editing'));
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
        details: { raw_video_url: rawVideoUrl, editing_requirements: editingRequirements, video_duration: videoDuration }
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
        title="Video Editing"
        description={service.description}
        accentIcon={<FaFilm />}
        iconBgFrom="from-purple-500" iconBgTo="to-violet-600"
        orb1="rgba(168,85,247,0.2)" orb2="rgba(139,92,246,0.12)" orb3="rgba(236,72,153,0.08)"
        polygonStroke="#a855f7"
        badge="Live Service" badgeDot="bg-emerald-400"
        rightPanel={<EditSuitePanel />}
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
            accentGradient="from-purple-500 via-violet-500 to-transparent"
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
                backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Raw Video File URL (Google Drive, Dropbox, etc.)
                </label>
                <input type="url" required value={rawVideoUrl}
                  onChange={(e) => setRawVideoUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                  data-testid="raw-video-url-input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Video Duration (approximate)
                </label>
                <input type="text" required value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  placeholder="e.g., 10 minutes"
                  className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                  data-testid="video-duration-input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Editing Requirements</label>
                <textarea required rows={6} value={editingRequirements}
                  onChange={(e) => setEditingRequirements(e.target.value)}
                  placeholder="Describe what you need: color grading, transitions, music, text overlays, etc."
                  className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none resize-none"
                  data-testid="editing-requirements-input"
                />
              </div>
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 to-violet-900/30 border border-purple-500/30 p-6 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.12)]">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500" />
                <div className="flex justify-between items-center">
                  <p className="text-gray-300 text-sm">Service Cost</p>
                  <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                    ${service.base_price.toFixed(2)}
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
    </CreatorLayout>
  );
};

export default VideoEditing;
