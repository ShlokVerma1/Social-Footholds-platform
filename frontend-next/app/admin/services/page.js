'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { serviceAPI } from '@/lib/api';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally { setLoading(false); }
  };

  const handleEdit = (service) => { setEditingId(service.id); setEditForm(service); };

  const handleSave = async () => {
    try {
      await serviceAPI.update(editingId, editForm);
      setEditingId(null);
      fetchServices();
    } catch (error) { console.error('Error updating service:', error); alert('Failed to update service'); }
  };

  const handleCancel = () => { setEditingId(null); setEditForm({}); };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div data-testid="admin-services-page">
        <h1 className="text-4xl font-bold text-white mb-8">Service Pricing Management</h1>
        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20" data-testid={`service-${service.id}`}>
              {editingId === service.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Service Name</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                      data-testid="service-name-input" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                      rows="3" data-testid="service-description-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Pricing Type</label>
                      <select value={editForm.pricing_type} onChange={(e) => setEditForm({ ...editForm, pricing_type: e.target.value })}
                        className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                        data-testid="service-pricing-type-select">
                        <option value="per_view" className="bg-gray-900">Per View</option>
                        <option value="subscription" className="bg-gray-900">Subscription</option>
                        <option value="per_project" className="bg-gray-900">Per Project</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Base Price ($)</label>
                      <input type="number" step="0.01" value={editForm.base_price}
                        onChange={(e) => setEditForm({ ...editForm, base_price: parseFloat(e.target.value) })}
                        className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                        data-testid="service-base-price-input" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition" data-testid="save-service-button">
                      <FaSave /> Save Changes
                    </button>
                    <button onClick={handleCancel} className="flex items-center gap-2 bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition" data-testid="cancel-service-button">
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Pricing Type</p>
                        <p className="text-white capitalize">{service.pricing_type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Base Price</p>
                        <p className="text-white text-xl font-bold">${service.base_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Features</p>
                        <p className="text-white">{service.features.length} items</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleEdit(service)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition ml-4"
                    data-testid={`edit-service-${service.id}-button`}>
                    <FaEdit /> Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-blue-500/20 border border-blue-500 rounded-lg">
          <h3 className="text-white font-semibold mb-2">💡 Pricing Guide</h3>
          <ul className="text-blue-300 text-sm space-y-1">
            <li><strong>Per View:</strong> Base price is per 1000 views (e.g., $10 = $10 per 1k views)</li>
            <li><strong>Subscription:</strong> Base price is per month (e.g., $499/month)</li>
            <li><strong>Per Project:</strong> Base price is one-time cost per project</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
