'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { serviceAPI } from '@/lib/api';
import { FaEdit, FaSave, FaTimes, FaTags, FaDollarSign, FaListUl, FaInfoCircle, FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally { setLoading(false); }
  };

  const handleEdit = (service) => { setEditingId(service.id); setEditForm({ ...service }); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await serviceAPI.update(editingId, editForm);
      setEditingId(null);
      fetchServices();
    } catch (error) { 
      console.error('Error updating service:', error); 
      alert('Failed to update service'); 
    }
  };

  const handleCancel = () => { setEditingId(null); setEditForm({}); };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div data-testid="admin-services-page" className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">Service Pricing</h1>
            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-semibold">
              {services.length} active
            </span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <FaInfoCircle className="text-blue-400 mt-0.5 text-lg" />
          <div>
            <h3 className="text-blue-300 font-semibold mb-1 text-sm">Pricing Calculation Guide</h3>
            <ul className="text-blue-200/80 text-xs space-y-1">
              <li><strong className="text-blue-200">Per View:</strong> Base price represents cost per 1,000 views.</li>
              <li><strong className="text-blue-200">Subscription:</strong> Base price represents monthly recurring cost.</li>
              <li><strong className="text-blue-200">Per Project:</strong> Base price represents one-time flat fee.</li>
            </ul>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-purple-500/15 overflow-hidden transition-all duration-300 hover:border-purple-500/30">
              
              {/* Decorative Header Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

              <div className="p-6 md:p-8">
                {editingId === service.id ? (
                  /* Edit Mode */
                  <form onSubmit={handleSave} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FaCog className="text-purple-400" />
                        Edit Service
                      </h3>
                      <button type="button" onClick={handleCancel} className="p-1.5 text-gray-500 hover:text-white transition">
                        <FaTimes />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Name</label>
                      <input 
                        type="text" required
                        value={editForm.name || ''} 
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 hover:border-white/20 focus:border-purple-500/50 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        required rows="2"
                        value={editForm.description || ''} 
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 hover:border-white/20 focus:border-purple-500/50 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none transition resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Structure</label>
                        <select 
                          value={editForm.pricing_type || 'per_project'} 
                          onChange={(e) => setEditForm({ ...editForm, pricing_type: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 hover:border-white/20 focus:border-purple-500/50 text-white px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition appearance-none"
                        >
                          <option value="per_view" className="bg-gray-900">Per View</option>
                          <option value="subscription" className="bg-gray-900">Subscription</option>
                          <option value="per_project" className="bg-gray-900">Per Project</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Base Price ($)</label>
                        <div className="relative">
                          <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                          <input 
                            type="number" step="0.01" required min="0"
                            value={editForm.base_price || 0}
                            onChange={(e) => setEditForm({ ...editForm, base_price: parseFloat(e.target.value) })}
                            className="w-full bg-black/20 border border-white/10 hover:border-white/20 focus:border-purple-500/50 text-white pl-8 pr-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button 
                        type="submit" 
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-500/20"
                      >
                        <FaSave /> Save Changes
                      </button>
                      <button 
                        type="button" onClick={handleCancel} 
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2.5 rounded-xl transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode */
                  <div className="animate-in fade-in flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                      </div>
                      <button 
                        onClick={() => handleEdit(service)}
                        className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition shrink-0 ml-4 group"
                        title="Edit Service"
                      >
                        <FaEdit className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1.5 mb-1">
                            <FaTags className="text-purple-500/70" /> Type
                          </p>
                          <p className="text-white text-xs font-semibold capitalize max-w-full truncate">
                            {service.pricing_type?.replace('_', ' ') || 'Unknown'}
                          </p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1.5 mb-1">
                            <FaDollarSign className="text-green-500/70" /> Base
                          </p>
                          <p className="text-green-400 text-sm font-black truncate">
                            ${Number(service.base_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1.5 mb-1">
                            <FaListUl className="text-blue-500/70" /> Details
                          </p>
                          <p className="text-white text-xs font-semibold truncate">
                            {service.features?.length || 0} features
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
