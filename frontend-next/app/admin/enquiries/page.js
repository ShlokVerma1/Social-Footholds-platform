'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { enquiryAPI } from '@/lib/api';
import { FaEnvelope } from 'react-icons/fa';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchEnquiries(); }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryAPI.getAll();
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      await enquiryAPI.updateStatus(enquiryId, newStatus);
      fetchEnquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredEnquiries = enquiries.filter(enq => filter === 'all' || enq.status === filter);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div data-testid="admin-enquiries-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Enquiry Management</h1>
          <div className="text-gray-400">Total Enquiries: <span className="text-white font-bold">{enquiries.length}</span></div>
        </div>
        <div className="flex gap-4 mb-6 flex-wrap">
          {['all', 'new', 'contacted', 'closed'].map((status) => (
            <button key={status} onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg transition capitalize ${filter === status ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              data-testid={`filter-${status}-button`}>
              {status} ({enquiries.filter(e => status === 'all' || e.status === status).length})
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEnquiries.length === 0 ? (
            <div className="col-span-2 bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-purple-500/20 text-center text-gray-400">No enquiries found</div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20" data-testid={`enquiry-${enquiry.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{enquiry.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <FaEnvelope /><span>{enquiry.email}</span>
                    </div>
                    {enquiry.service && (
                      <span className="inline-block px-3 py-1 bg-purple-600/30 border border-purple-500 text-purple-300 rounded-full text-xs">{enquiry.service}</span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                    enquiry.status === 'new' ? 'bg-blue-500/20 border border-blue-500 text-blue-300'
                    : enquiry.status === 'contacted' ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                    : 'bg-green-500/20 border border-green-500 text-green-300'
                  }`}>{enquiry.status}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg mb-4">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{enquiry.message}</p>
                </div>
                {enquiry.channel_link && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-1">Channel/Video Link:</p>
                    <a href={enquiry.channel_link} target="_blank" rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm break-all underline">{enquiry.channel_link}</a>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-xs">{new Date(enquiry.created_at).toLocaleString()}</p>
                  <select value={enquiry.status} onChange={(e) => handleStatusUpdate(enquiry.id, e.target.value)}
                    className="bg-white/10 border border-purple-500/30 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                    data-testid={`status-select-${enquiry.id}`}>
                    <option value="new" className="bg-gray-900">New</option>
                    <option value="contacted" className="bg-gray-900">Contacted</option>
                    <option value="closed" className="bg-gray-900">Closed</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
