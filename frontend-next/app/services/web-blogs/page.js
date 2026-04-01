'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGlobe, FaCheckCircle } from 'react-icons/fa';
import CreatorLayout from '@/components/CreatorLayout';
import ServicePageShell from '@/components/service/ServicePageShell';
import BrowserPreviewPanel from '@/components/service/panels/BrowserPreviewPanel';
import { serviceAPI, orderAPI } from '@/lib/api';

const WebBlogs = () => {
  const router = useRouter();
  const [service, setService] = useState(null);
  const [projectType, setProjectType] = useState('website');
  const [websiteRequirements, setWebsiteRequirements] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchService(); }, []);

  const fetchService = async () => {
    try {
      const response = await serviceAPI.getAll();
      setService(response.data.find(s => s.name === 'Web Page & Blogs'));
    } catch (error) { console.error('Error fetching service:', error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await orderAPI.create({
        service_id: service.id,
        details: { project_type: projectType, requirements: websiteRequirements, target_audience: targetAudience }
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
      {/* ServicePageShell: indigo/violet accent for Web & Blogs */}
      <ServicePageShell
        title="Web Page & Blogs"
        description={service.description}
        accentIcon={<FaGlobe />}
        iconBgFrom="from-indigo-500" iconBgTo="to-violet-600"
        orb1="rgba(99,102,241,0.18)" orb2="rgba(139,92,246,0.12)" orb3="rgba(59,130,246,0.08)"
        polygonStroke="#6366f1"
        badge="Live Service" badgeDot="bg-emerald-400"
        rightPanel={<BrowserPreviewPanel />}
      >
        {/* ── ORDER FORM ────────────────────────────── */}
        <motion.div
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-8 rounded-3xl"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-3xl"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

            {/* Project Type */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Project Type</label>
              <select value={projectType} onChange={(e) => setProjectType(e.target.value)}
                className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                data-testid="project-type-select"
              >
                <option value="website" className="bg-gray-900">Professional Website</option>
                <option value="blog"    className="bg-gray-900">Blog Setup & Writing</option>
                <option value="both"    className="bg-gray-900">Website + Blog</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Target Audience</label>
              <input type="text" required value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Who are you trying to reach?"
                className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none"
                data-testid="target-audience-input"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Requirements & Details</label>
              <textarea required rows={6} value={websiteRequirements}
                onChange={(e) => setWebsiteRequirements(e.target.value)}
                placeholder="Describe your project: pages needed, design preferences, content topics, features, etc."
                className="form-input-glow w-full bg-white/5 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none resize-none"
                data-testid="requirements-input"
              />
            </div>

            {/* Price display */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/40 to-violet-900/30
              border border-indigo-500/30 p-6 rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.12)]">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
              <div className="flex justify-between items-center">
                <p className="text-gray-300 text-sm">Service Cost</p>
                <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  ${service.base_price.toFixed(2)}
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

export default WebBlogs;
