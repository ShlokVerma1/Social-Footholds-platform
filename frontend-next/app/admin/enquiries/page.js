'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  FaSearch, FaFilter, FaTimes, FaChevronDown,
  FaCheckCircle, FaSpinner, FaFileCsv,
  FaEnvelope, FaLink, FaCommentDots, FaClock, FaExclamationTriangle
} from 'react-icons/fa';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STATUS_OPTIONS = ['new', 'contacted', 'closed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'; }
function shortId(id = '') { return String(id).slice(0, 8); }

const STATUS_META = {
  new:       { color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30'   },
  contacted: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30'},
  closed:    { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30' },
};
function statusMeta(s) { return STATUS_META[s] || STATUS_META.new; }

const PRIORITY_META = {
  low:    { color: 'text-gray-400',   bg: 'bg-gray-500/10 border-gray-500/30', icon: null },
  medium: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: null },
  high:   { color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30', icon: <FaExclamationTriangle className="text-[10px]" /> },
};
function priorityMeta(p) { return PRIORITY_META[p || 'low']; }

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl backdrop-blur-xl transition-all duration-300 pointer-events-auto
            ${t.type === 'success' ? 'bg-green-900/80 border-green-500/40 text-green-200' : 'bg-red-900/80 border-red-500/40 text-red-200'}`}
        >
          {t.type === 'success' ? <FaCheckCircle className="text-green-400 shrink-0" /> : <FaTimes className="text-red-400 shrink-0" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function AdminEnquiries() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (e) {
      console.error('[fetch enquiries]', e);
      addToast('Failed to load enquiries', 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, addToast]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  // Client-side filtering
  const filteredEnquiries = enquiries.filter((e) => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || (e.priority || 'low') === priorityFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q
      || (e.name || '').toLowerCase().includes(q)
      || (e.email || '').toLowerCase().includes(q)
      || (e.message || '').toLowerCase().includes(q)
      || (e.service || '').toLowerCase().includes(q);
    return matchStatus && matchPriority && matchSearch;
  });

  const handleUpdate = async (id, field, value) => {
    try {
      const updates = { [field]: value };
      
      // Auto timestamps logic
      if (field === 'status' && value === 'responded') {
          updates.admin_responded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('enquiries')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      addToast(`Updated successfully`, 'success');
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    } catch (e) {
      console.error('[update enquiry]', e);
      addToast('Update failed', 'error');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Service', 'Message', 'Channel Link', 'Priority', 'Status', 'Created At', 'Responded At'];
    const rows = filteredEnquiries.map(e => [
      `"${shortId(e.id)}"`,
      `"${(e.name || 'Unknown').replace(/"/g, '""')}"`,
      `"${e.email || ''}"`,
      `"${e.service || ''}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${e.channel_link || ''}"`,
      `"${e.priority || 'low'}"`,
      `"${e.status}"`,
      `"${new Date(e.created_at).toLocaleDateString()}"`,
      `"${e.admin_responded_at ? new Date(e.admin_responded_at).toLocaleDateString() : ''}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(line => line.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="admin-enquiries-page" className="space-y-6 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">Enquiries</h1>
            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-semibold">
              {enquiries.length} total
            </span>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              {enquiries.filter(e => e.status === 'new').length} New
            </span>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          <div className="flex gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative flex-1 md:flex-initial">
              <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-sm text-white rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-purple-500/50 transition appearance-none min-w-[140px]"
              >
                <option value="all" className="bg-gray-900">All Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-gray-900 capitalize">{s}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
            </div>

            {/* Priority Filter */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-sm text-white rounded-xl pl-4 pr-8 py-2.5 focus:outline-none focus:border-purple-500/50 transition appearance-none min-w-[140px]"
              >
                <option value="all" className="bg-gray-900">All Priorities</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p} className="bg-gray-900 capitalize">{p}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 placeholder-gray-600 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* CSV */}
            <button
              onClick={handleExportCSV}
              className="flex justify-center items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-sm font-medium transition"
            >
              <FaFileCsv className="text-purple-400 text-lg" /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* ── Enquiries Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-12 text-center text-gray-500">
            <FaSearch className="mx-auto mb-3 text-2xl opacity-30" />
            <p className="font-medium">No enquiries match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredEnquiries.map((enquiry) => {
              const sm = statusMeta(enquiry.status);
              const pm = priorityMeta(enquiry.priority);
              
              return (
                <div key={enquiry.id} className="bg-white/5 border border-purple-500/15 rounded-2xl p-5 md:p-6 transition-all hover:bg-white/10 flex flex-col h-full">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-3">
                        {enquiry.name}
                        {enquiry.status === 'new' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </h3>
                      <a href={`mailto:${enquiry.email}`} className="text-gray-400 text-sm hover:text-purple-400 transition flex items-center gap-1.5 mt-1">
                        <FaEnvelope className="text-[10px]" /> {enquiry.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${pm.bg} ${pm.color}`}>
                        {pm.icon} {enquiry.priority || 'low'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${sm.bg} ${sm.color}`}>
                        {enquiry.status}
                      </span>
                    </div>
                  </div>

                  {/* Badge Row */}
                  <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
                    {enquiry.service && (
                      <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg">
                        {enquiry.service}
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-lg font-mono">
                      #{shortId(enquiry.id)}
                    </span>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-lg flex items-center gap-1.5">
                      <FaClock className="text-[10px]" /> {fmtDate(enquiry.created_at)}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed flex items-start gap-2.5">
                      <FaCommentDots className="text-purple-500/50 mt-1 flex-shrink-0" />
                      {enquiry.message}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-auto border-t border-white/5 pt-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    
                    {/* Link if provided */}
                    <div className="flex-1 min-w-0 pr-4">
                      {enquiry.channel_link ? (
                        <a 
                          href={enquiry.channel_link.startsWith('http') ? enquiry.channel_link : `https://${enquiry.channel_link}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition text-sm truncate"
                        >
                          <FaLink className="text-[10px] flex-shrink-0" /> 
                          <span className="truncate">{enquiry.channel_link}</span>
                        </a>
                      ) : (
                        <span className="text-gray-600 text-sm italic">No link provided</span>
                      )}
                    </div>

                    {/* Admin Selectors */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <select 
                        value={enquiry.priority || 'low'} 
                        onChange={(e) => handleUpdate(enquiry.id, 'priority', e.target.value)}
                        className="flex-1 md:flex-initial bg-white/5 border border-white/10 hover:border-purple-500/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none transition appearance-none capitalize cursor-pointer text-center"
                      >
                        {PRIORITY_OPTIONS.map(p => <option key={p} value={p} className="bg-gray-900">{p} Priority</option>)}
                      </select>
                      
                      <select 
                        value={enquiry.status} 
                        onChange={(e) => handleUpdate(enquiry.id, 'status', e.target.value)}
                        className="flex-1 md:flex-initial bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none transition appearance-none capitalize cursor-pointer text-center"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-gray-900">{s} Status</option>)}
                      </select>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
      <Toast toasts={toasts} />
    </AdminLayout>
  );
}
