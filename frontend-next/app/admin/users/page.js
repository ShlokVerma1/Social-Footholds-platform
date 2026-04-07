'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  FaSearch, FaTimes, FaUser, FaEnvelope, FaCalendar,
  FaShoppingBag, FaBan, FaCheckCircle, FaSpinner,
  FaExternalLinkAlt, FaChevronRight, FaFileCsv, FaPhone, FaTrash, FaPlus
} from 'react-icons/fa';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmtDate(d) {
  return d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
}
function shortId(id = '') { return String(id).slice(0, 8); }

const ORDER_STATUS = {
  pending:    { cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400'   },
  processing: { cls: 'bg-blue-500/10 border-blue-500/30 text-blue-400'     },
  completed:  { cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  cancelled:  { cls: 'bg-red-500/10 border-red-500/30 text-red-400'        },
};
function orderStatusCls(s) { return (ORDER_STATUS[s] || ORDER_STATUS.pending).cls; }

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl backdrop-blur-xl pointer-events-auto
            ${t.type === 'success'
              ? 'bg-green-900/80 border-green-500/40 text-green-200'
              : 'bg-red-900/80 border-red-500/40 text-red-200'}`}
        >
          {t.type === 'success'
            ? <FaCheckCircle className="text-green-400 shrink-0" />
            : <FaTimes className="text-red-400 shrink-0" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// User Drawer
// ---------------------------------------------------------------------------
function UserDrawer({ user: profile, onClose, onUserUpdated, addToast }) {
  const supabase = createClient();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Fetch last 5 orders for this user
  useEffect(() => {
    if (!profile?.id) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) console.error('[user drawer] orders fetch:', error);
      setOrders(data || []);
      setOrdersLoading(false);
    };
    fetchOrders();
  }, [profile?.id]);

  async function handleDeleteOrder(orderId) {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      setOrders(orders.filter(o => o.id !== orderId));
      addToast('Campaign deleted successfully', 'success');
      onUserUpdated({ ...profile, orders: [{ count: (orderCount - 1) }] });
    } catch (e) {
      console.error('[delete order]', e);
      addToast('Failed to delete campaign', 'error');
    }
  }

  const [addingCampaign, setAddingCampaign] = useState(false);
  const [newCampaignFormData, setNewCampaignFormData] = useState({
    service_name: 'Video Promotion',
    amount: 50,
    status: 'pending',
    payment_status: 'paid',
  });
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCreatingCampaign(true);
    try {
      const { data, error } = await supabase.from('orders').insert([{
        user_id: profile.id,
        service_name: newCampaignFormData.service_name,
        amount: newCampaignFormData.amount,
        status: newCampaignFormData.status,
        payment_status: newCampaignFormData.payment_status,
        details: { admin_created: true },
        current_milestone: 0
      }]).select('*');
      
      if (error) throw error;
      if (data && data.length > 0) {
        setOrders([data[0], ...orders]);
        setAddingCampaign(false);
        addToast('Campaign created successfully', 'success');
        onUserUpdated({ ...profile, orders: [{ count: (orderCount + 1) }] });
        setNewCampaignFormData({ service_name: 'Video Promotion', amount: 50, status: 'pending', payment_status: 'paid' });
      }
    } catch (e) {
      console.error('[create order]', e);
      addToast('Failed to create campaign', 'error');
    } finally {
      setCreatingCampaign(false);
    }
  }

  async function handleToggleSuspend() {
    setToggling(true);
    const newValue = !profile.is_suspended;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: newValue })
        .eq('id', profile.id);

      if (error) throw error;

      addToast(
        newValue ? `${profile.name} has been suspended` : `${profile.name} has been activated`,
        'success'
      );
      onUserUpdated({ ...profile, is_suspended: newValue });
    } catch (e) {
      console.error('[toggle suspend]', e);
      addToast('Failed to update account status', 'error');
    } finally {
      setToggling(false);
    }
  }

  const isSuspended = !!profile.is_suspended;
  const orderCount = profile.orders?.[0]?.count ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[110] w-full max-w-md bg-gradient-to-b from-gray-900 via-[#0d0d1a] to-gray-900 border-l border-purple-500/20 shadow-2xl overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-900/90 backdrop-blur-xl border-b border-purple-500/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {profile.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{profile.name}</h2>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            data-testid="drawer-close-btn"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-6">

          {/* Suspended banner */}
          {isSuspended && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
              <FaBan className="shrink-0" />
              This account is currently suspended. The user cannot access the platform.
            </div>
          )}

          {/* Profile info */}
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FaUser className="text-[10px]" /> Profile
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 text-xs mb-0.5">Full Name</p>
                <p className="text-white font-medium">{profile.name || '—'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-0.5">Role</p>
                <p className="text-gray-300 capitalize">{profile.role || 'creator'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-xs mb-0.5">Email</p>
                <p className="text-gray-300 flex items-center gap-1.5">
                  <FaEnvelope className="text-purple-500 text-[10px]" /> {profile.email}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-0.5">Joined</p>
                <p className="text-gray-300 flex items-center gap-1.5">
                  <FaCalendar className="text-purple-500 text-[10px]" /> {fmtDate(profile.created_at)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-0.5">Total Orders</p>
                <p className="text-gray-300 flex items-center gap-1.5">
                  <FaShoppingBag className="text-purple-500 text-[10px]" /> {orderCount}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-0.5">Account Status</p>
                {isSuspended
                  ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold"><FaBan className="text-[8px]" /> Suspended</span>
                  : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"><FaCheckCircle className="text-[8px]" /> Active</span>
                }
              </div>
            </div>
          </div>

          {/* Order history */}
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <FaShoppingBag className="text-[10px]" /> Recent Orders
              </h3>
              <Link
                href={`/admin/orders`}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition"
                data-testid="view-all-orders-link"
              >
                View All <FaExternalLinkAlt className="text-[9px]" />
              </Link>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-6 gap-2 text-gray-500 text-sm">
                <FaSpinner className="animate-spin text-xs" /> Loading orders…
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-4">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white/3 border border-white/8 rounded-xl"
                    data-testid={`order-item-${order.id}`}
                  >
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{order.service_name}</p>
                      <p className="text-gray-600 text-[10px] font-mono">#{shortId(order.id)} · {fmtDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <p className="text-purple-400 text-xs font-bold">${Number(order.amount || 0).toFixed(2)}</p>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${orderStatusCls(order.status)}`}>
                        {order.status}
                      </span>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition ml-1"
                        title="Delete campaign"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add Campaign Section */}
            <div className="mt-4 pt-4 border-t border-purple-500/10">
              {!addingCampaign ? (
                <button 
                  onClick={() => setAddingCampaign(true)}
                  className="w-full py-2 flex items-center justify-center gap-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition"
                >
                  <FaPlus className="text-[10px]" /> Add Campaign
                </button>
              ) : (
                <form onSubmit={handleCreateCampaign} className="space-y-3 bg-white/3 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-white mb-2">Create New Campaign</h4>
                  
                  <div>
                    <label className="block text-gray-400 text-[10px] mb-1">Service</label>
                    <select 
                      value={newCampaignFormData.service_name}
                      onChange={e => setNewCampaignFormData({...newCampaignFormData, service_name: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="Video Promotion">Video Promotion</option>
                      <option value="Music Promotion">Music Promotion</option>
                      <option value="Channel SEO Optimization">Channel SEO Optimization</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Shorts Creation">Shorts Creation</option>
                      <option value="Web Page & Blogs">Web Page & Blogs</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-[10px] mb-1">Amount ($)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.01"
                        value={newCampaignFormData.amount}
                        onChange={e => setNewCampaignFormData({...newCampaignFormData, amount: parseFloat(e.target.value)})}
                        className="w-full bg-black/30 border border-white/10 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px] mb-1">Payment</label>
                      <select 
                        value={newCampaignFormData.payment_status}
                        onChange={e => setNewCampaignFormData({...newCampaignFormData, payment_status: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit"
                      disabled={creatingCampaign}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition flex justify-center items-center gap-2"
                    >
                      {creatingCampaign ? <FaSpinner className="animate-spin" /> : 'Create'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAddingCampaign(false)}
                      className="flex-1 py-2 bg-white/10 text-white text-xs font-semibold rounded-lg hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Suspend / Activate */}
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FaBan className="text-[10px]" /> Account Control
            </h3>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">
              {isSuspended
                ? 'This account is suspended. Activating it will restore the user\'s access to all platform features.'
                : 'Suspending this account will immediately block the user from accessing the platform.'}
            </p>
            <button
              onClick={handleToggleSuspend}
              disabled={toggling}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed
                ${isSuspended
                  ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-400/50'
                  : 'bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 hover:border-red-400/50'
                }`}
              data-testid={isSuspended ? 'activate-user-btn' : 'suspend-user-btn'}
            >
              {toggling
                ? <><FaSpinner className="animate-spin" /> Updating…</>
                : isSuspended
                  ? <><FaCheckCircle /> Activate Account</>
                  : <><FaBan /> Suspend Account</>
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, orders(count)')
        .neq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (e) {
      console.error('[fetch users]', e);
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Client-side search
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  function handleUserUpdated(updated) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    if (selectedUser?.id === updated.id) setSelectedUser((prev) => ({ ...prev, ...updated }));
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Joined Date', 'Orders Count', 'Status'];
    const rows = filteredUsers.map(u => [
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.role || 'creator'}"`,
      `"${new Date(u.created_at).toLocaleDateString()}"`,
      u.orders?.[0]?.count || 0,
      u.is_suspended ? 'Suspended' : 'Active'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div data-testid="admin-users-page" className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-semibold">
              {users.length} creators
            </span>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/10 transition text-sm font-medium"
          >
            <FaFileCsv className="text-purple-400" /> Export CSV
          </button>
        </div>

        {/* ── Search ── */}
        <div className="relative max-w-sm">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:border-purple-500/50 placeholder-gray-600 transition"
            data-testid="search-users-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl overflow-hidden">

            {/* Desktop table header */}
            <div className="hidden lg:grid grid-cols-[1.2fr_1.5fr_1.2fr_110px_80px_90px_52px] gap-4 px-5 py-3 border-b border-purple-500/10">
              {['Creator', 'Email', 'Phone', 'Joined', 'Orders', 'Status', ''].map((h) => (
                <div key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</div>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-purple-500/8">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
                  <FaSearch className="text-xl opacity-30" />
                  <p className="text-sm">No creators found</p>
                </div>
              ) : (
                filteredUsers.map((creator) => {
                  const isSuspended = !!creator.is_suspended;
                  const orderCount = creator.orders?.[0]?.count ?? 0;

                  return (
                    <React.Fragment key={creator.id}>
                      {/* Desktop row */}
                      <div
                        className="hidden lg:grid grid-cols-[1.2fr_1.5fr_1.2fr_110px_80px_90px_52px] gap-4 px-5 py-4 items-center hover:bg-white/3 transition group"
                        data-testid={`user-row-${creator.id}`}
                      >
                        {/* Name */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {creator.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="text-white text-sm font-medium truncate">{creator.name || '—'}</span>
                        </div>

                        {/* Email */}
                        <span className="text-gray-400 text-sm truncate">{creator.email}</span>

                        {/* Phone */}
                        <span className="text-gray-400 text-sm truncate flex items-center gap-1.5">
                          {creator.phone ? <><FaPhone className="text-[10px] text-purple-500" /> {creator.phone}</> : '—'}
                        </span>

                        {/* Joined */}
                        <span className="text-gray-500 text-xs">{fmtDate(creator.created_at)}</span>

                        {/* Orders */}
                        <span className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
                          <FaShoppingBag className="text-purple-500 text-[10px]" /> {orderCount}
                        </span>

                        {/* Status */}
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                            <FaBan className="text-[8px]" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                            <FaCheckCircle className="text-[8px]" /> Active
                          </span>
                        )}

                        {/* Actions */}
                        <button
                          onClick={() => setSelectedUser(creator)}
                          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-600/30 hover:border-purple-400/50 transition opacity-0 group-hover:opacity-100"
                          data-testid={`user-actions-btn-${creator.id}`}
                        >
                          <FaChevronRight className="text-[9px]" />
                        </button>
                      </div>

                      {/* Mobile card */}
                      <div
                        className="lg:hidden p-4 space-y-3"
                        data-testid={`user-card-${creator.id}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {creator.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-semibold text-sm truncate">{creator.name || '—'}</p>
                              <p className="text-gray-500 text-xs truncate">{creator.email}</p>
                            </div>
                          </div>
                          {isSuspended ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-semibold flex-shrink-0">
                              <FaBan className="text-[7px]" /> Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex-shrink-0">
                              <FaCheckCircle className="text-[7px]" /> Active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaCalendar className="text-[9px]" /> {fmtDate(creator.created_at)}</span>
                          <span className="flex items-center gap-1"><FaShoppingBag className="text-[9px] text-purple-500" /> {orderCount} orders</span>
                        </div>

                        <button
                          onClick={() => setSelectedUser(creator)}
                          className="w-full py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition"
                        >
                          View Details
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Detail Drawer */}
      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={handleUserUpdated}
          addToast={addToast}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} />
    </AdminLayout>
  );
}
