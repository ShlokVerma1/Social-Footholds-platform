'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';
import {
  FaSearch, FaFilter, FaTimes, FaChevronDown, FaCircle,
  FaPlus, FaSave, FaCheckCircle, FaClock, FaBan, FaSpinner,
  FaUser, FaEnvelope, FaCalendar, FaDollarSign, FaStickyNote,
  FaFlag, FaSync, FaChevronRight, FaFileCsv
} from 'react-icons/fa';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'];
const FILTER_TABS = ['all', ...STATUS_OPTIONS];

const SERVICE_MILESTONES = {
  'Video Promotion': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Content Review', icon: '🔍' },
    { label: 'Campaign Setup', icon: '⚙️' },
    { label: 'Campaign Live', icon: '🚀' },
    { label: 'Results Delivered', icon: '📊' },
    { label: 'Completed', icon: '✅' },
  ],
  'Music Promotion': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Track Review', icon: '🎵' },
    { label: 'Playlist Outreach', icon: '📢' },
    { label: 'Placement Confirmed', icon: '🎯' },
    { label: 'Streams Growing', icon: '📈' },
    { label: 'Completed', icon: '✅' },
  ],
  'Channel SEO Optimization': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Channel Audit', icon: '🔎' },
    { label: 'Strategy Prepared', icon: '📝' },
    { label: 'Optimisation Live', icon: '⚡' },
    { label: 'Monitoring', icon: '👁️' },
    { label: 'Completed', icon: '✅' },
  ],
  'Video Editing': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Brief Review', icon: '📄' },
    { label: 'Editing In Progress', icon: '✂️' },
    { label: 'First Draft Sent', icon: '📤' },
    { label: 'Revisions', icon: '🔄' },
    { label: 'Final Delivered', icon: '✅' },
  ],
  'Shorts Creation': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Content Review', icon: '🔍' },
    { label: 'Editing In Progress', icon: '✂️' },
    { label: 'Draft Sent', icon: '📤' },
    { label: 'Revisions', icon: '🔄' },
    { label: 'Final Delivered', icon: '✅' },
  ],
  'Web Page & Blogs': [
    { label: 'Order Received', icon: '📋' },
    { label: 'Brief Review', icon: '📄' },
    { label: 'Design & Writing', icon: '🎨' },
    { label: 'Review & Feedback', icon: '💬' },
    { label: 'Revisions', icon: '🔄' },
    { label: 'Live & Delivered', icon: '✅' },
  ],
};

// Zod schemas
const noteSchema = z.object({
  adminNotes: z
    .string()
    .max(1000, 'Admin note must be 1000 characters or fewer')
    .transform((v) => v.replace(/<[^>]*>/g, '').trim()),
  clientNotes: z
    .string()
    .max(1000, 'Client note must be 1000 characters or fewer')
    .transform((v) => v.replace(/<[^>]*>/g, '').trim()),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shortId(id = '') { return String(id).slice(0, 8); }
function fmtAmount(v) { return `$${Number(v || 0).toFixed(2)}`; }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }

function getMilestones(serviceName) {
  const found = Object.keys(SERVICE_MILESTONES).find(
    (k) => k.toLowerCase() === (serviceName || '').toLowerCase()
  );
  return found ? SERVICE_MILESTONES[found] : null;
}

function getMilestoneName(serviceName, idx) {
  const steps = getMilestones(serviceName);
  if (!steps) return 'N/A';
  return steps[idx]?.label || 'N/A';
}

const STATUS_META = {
  pending:    { color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/30',  dot: 'bg-amber-400'  },
  processing: { color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30',    dot: 'bg-blue-400'   },
  completed:  { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30',  dot: 'bg-green-400'  },
  cancelled:  { color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',      dot: 'bg-red-400'    },
};
function statusMeta(s) { return STATUS_META[s] || STATUS_META.pending; }

const PAYMENT_META = {
  paid:    { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30'  },
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
};
function paymentMeta(s) { return PAYMENT_META[s] || PAYMENT_META.pending; }

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
// Milestone Tracker
// ---------------------------------------------------------------------------
function MilestoneTracker({ order, onMilestoneClick, updating }) {
  const milestones = getMilestones(order.service_name);
  if (!milestones) return (
    <p className="text-gray-500 text-sm">No milestone map for this service.</p>
  );

  const current = Number(order.current_milestone ?? 0);

  return (
    <div className="flex flex-col gap-2">
      {milestones.map((step, idx) => {
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <button
            key={idx}
            onClick={() => onMilestoneClick(idx)}
            disabled={updating}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed
              ${isActive
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : isDone
                  ? 'bg-green-600/10 border-green-500/20 text-green-400'
                  : 'bg-white/3 border-white/10 text-gray-500 hover:bg-white/5 hover:border-purple-500/20 hover:text-gray-300'
              }`}
          >
            <span className="text-base leading-none">{step.icon}</span>
            <span className="text-sm font-medium flex-1">{step.label}</span>
            {isDone && <FaCheckCircle className="text-green-400 text-xs shrink-0" />}
            {isActive && <FaCircle className="text-purple-400 text-xs shrink-0 animate-pulse" />}
            {!isDone && !isActive && (
              <FaChevronRight className="text-gray-600 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order Detail Drawer
// ---------------------------------------------------------------------------
function OrderDrawer({ order, onClose, onOrderUpdated, addToast }) {
  const supabase = createClient();
  const { user } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [clientNotes, setClientNotes] = useState(order.client_notes || '');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingMilestone, setUpdatingMilestone] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [noteErrors, setNoteErrors] = useState({});
  const overlayRef = useRef(null);

  const internalSecret = process.env.NEXT_PUBLIC_INTERNAL_API_SECRET;

  async function callEmailApi(payload) {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${internalSecret}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error('[email] failed:', e);
    }
  }

  async function handleStatusUpdate() {
    if (selectedStatus === order.status) return;
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: selectedStatus,
          status_updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (error) throw error;

      const milestoneName = getMilestoneName(order.service_name, order.current_milestone ?? 0);
      await callEmailApi({
        type: 'status_update',
        to: order.profiles?.email,
        creatorName: order.profiles?.name || 'Creator',
        orderId: order.id,
        serviceName: order.service_name,
        newStatus: selectedStatus,
        milestoneName,
        clientNote: order.client_notes || null,
      });

      addToast('Status updated successfully', 'success');
      onOrderUpdated({ ...order, status: selectedStatus, status_updated_at: new Date().toISOString() });
    } catch (e) {
      console.error('[status update]', e);
      addToast('Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleMilestoneClick(idx) {
    if (idx === (order.current_milestone ?? 0)) return;
    setUpdatingMilestone(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          current_milestone: idx,
          status_updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (error) throw error;

      const milestoneName = getMilestoneName(order.service_name, idx);
      await callEmailApi({
        type: 'status_update',
        to: order.profiles?.email,
        creatorName: order.profiles?.name || 'Creator',
        orderId: order.id,
        serviceName: order.service_name,
        newStatus: order.status,
        milestoneName,
        clientNote: order.client_notes || null,
      });

      addToast(`Milestone updated to "${milestoneName}"`, 'success');
      onOrderUpdated({ ...order, current_milestone: idx });
    } catch (e) {
      console.error('[milestone update]', e);
      addToast('Failed to update milestone', 'error');
    } finally {
      setUpdatingMilestone(false);
    }
  }

  async function handleSaveNotes() {
    setNoteErrors({});
    const parsed = noteSchema.safeParse({ adminNotes, clientNotes });
    if (!parsed.success) {
      const errs = {};
      parsed.error.errors.forEach((e) => { errs[e.path[0]] = e.message; });
      setNoteErrors(errs);
      return;
    }

    const { adminNotes: safeAdmin, clientNotes: safeClient } = parsed.data;
    const clientNoteChanged = safeClient !== (order.client_notes || '');

    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ admin_notes: safeAdmin, client_notes: safeClient })
        .eq('id', order.id);

      if (error) throw error;

      if (clientNoteChanged && order.profiles?.email) {
        const milestoneName = getMilestoneName(order.service_name, order.current_milestone ?? 0);
        await callEmailApi({
          type: 'status_update',
          to: order.profiles.email,
          creatorName: order.profiles?.name || 'Creator',
          orderId: order.id,
          serviceName: order.service_name,
          newStatus: order.status,
          milestoneName,
          clientNote: safeClient || null,
        });
      }

      addToast('Notes saved successfully', 'success');
      onOrderUpdated({ ...order, admin_notes: safeAdmin, client_notes: safeClient });
    } catch (e) {
      console.error('[save notes]', e);
      addToast('Failed to save notes', 'error');
    } finally {
      setSavingNotes(false);
    }
  }

  const sm = statusMeta(order.status);
  const pm = paymentMeta(order.payment_status);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[110] w-full max-w-xl bg-gradient-to-b from-gray-900 via-[#0d0d1a] to-gray-900 border-l border-purple-500/20 shadow-2xl overflow-y-auto flex flex-col">

        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-900/90 backdrop-blur-xl border-b border-purple-500/15">
          <div>
            <h2 className="text-lg font-bold text-white">Order Details</h2>
            <p className="text-xs text-gray-500 font-mono">#{shortId(order.id)}</p>
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

          {/* ── Section D: Order Details ── */}
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FaFlag className="text-xs" /> Order Details
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Service</p>
                <p className="text-white font-medium">{order.service_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Amount</p>
                <p className="text-purple-400 font-bold">{fmtAmount(order.amount)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${sm.bg} ${sm.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Payment</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${pm.bg} ${pm.color}`}>
                  {order.payment_status}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Date</p>
                <p className="text-gray-300">{fmtDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Order ID</p>
                <p className="text-gray-300 font-mono text-xs">{shortId(order.id)}</p>
              </div>
            </div>

            <div className="h-px bg-purple-500/10 my-2" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <FaUser className="text-purple-400 text-xs" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{order.profiles?.name || 'Unknown'}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <FaEnvelope className="text-[10px]" /> {order.profiles?.email || '—'}
                </p>
              </div>
            </div>

            {/* Existing notes display */}
            {order.admin_notes && (
              <div className="mt-2 p-3 bg-white/3 rounded-lg border border-white/8">
                <p className="text-xs text-gray-500 mb-1">Admin Note</p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{order.admin_notes}</p>
              </div>
            )}
            {order.client_notes && (
              <div className="mt-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/15">
                <p className="text-xs text-purple-500 mb-1">Client Note</p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{order.client_notes}</p>
              </div>
            )}
          </div>

          {/* ── Section A: Update Status ── */}
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaSync className="text-xs" /> Update Status
            </h3>
            <div className="flex gap-3 flex-wrap">
              {STATUS_OPTIONS.map((s) => {
                const m = statusMeta(s);
                const isSelected = selectedStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-all duration-200
                      ${isSelected
                        ? `${m.bg} ${m.color} shadow-[0_0_12px_rgba(168,85,247,0.15)]`
                        : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/8 hover:text-gray-200'
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? m.dot : 'bg-gray-600'}`} />
                    {s}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={updatingStatus || selectedStatus === order.status}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="update-status-btn"
            >
              {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
              {updatingStatus ? 'Updating...' : 'Apply Status'}
            </button>
          </div>

          {/* ── Section B: Milestone Tracker ── */}
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaFlag className="text-xs" /> Campaign Milestones
            </h3>
            <MilestoneTracker
              order={order}
              onMilestoneClick={handleMilestoneClick}
              updating={updatingMilestone}
            />
          </div>

          {/* ── Section C: Notes ── */}
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaStickyNote className="text-xs" /> Notes
            </h3>

            <div className="space-y-4">
              {/* Admin Note */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Internal Note <span className="text-gray-600">(admin only)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add an internal note..."
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 resize-none placeholder-gray-600 transition"
                  data-testid="admin-notes-input"
                />
                <div className="flex justify-between items-center mt-1">
                  {noteErrors.adminNotes && <p className="text-red-400 text-xs">{noteErrors.adminNotes}</p>}
                  <span className="text-gray-600 text-xs ml-auto">{adminNotes.length}/1000</span>
                </div>
              </div>

              {/* Client Note */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Client Note <span className="text-gray-600">(visible to creator — triggers email)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Add a message for the creator..."
                  className="w-full bg-white/5 border border-purple-500/20 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 resize-none placeholder-gray-600 transition"
                  data-testid="client-notes-input"
                />
                <div className="flex justify-between items-center mt-1">
                  {noteErrors.clientNotes && <p className="text-red-400 text-xs">{noteErrors.clientNotes}</p>}
                  <span className="text-gray-600 text-xs ml-auto">{clientNotes.length}/1000</span>
                </div>
              </div>

              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="save-notes-btn"
              >
                {savingNotes ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Create Order Modal
// ---------------------------------------------------------------------------
function CreateOrderModal({ onClose, onCreated, addToast }) {
  const supabase = createClient();
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ user_id: '', service_name: '', amount: '', admin_notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, email')
      .eq('role', 'creator')
      .order('name')
      .then(({ data }) => setProfiles(data || []));
  }, []);

  const internalSecret = process.env.NEXT_PUBLIC_INTERNAL_API_SECRET;

  async function handleCreate(e) {
    e.preventDefault();
    const amtNum = parseFloat(form.amount);
    if (!form.user_id || !form.service_name || isNaN(amtNum)) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const createSchema = z.object({
      user_id: z.string().uuid(),
      service_name: z.string().min(1).max(300).transform((v) => v.trim()),
      amount: z.number().positive(),
      admin_notes: z.string().max(1000).transform((v) => v.replace(/<[^>]*>/g, '').trim()),
    });

    const parsed = createSchema.safeParse({ ...form, amount: amtNum });
    if (!parsed.success) {
      addToast(parsed.error.errors[0].message, 'error');
      return;
    }

    setSaving(true);
    try {
      const profile = profiles.find((p) => p.id === form.user_id);
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: parsed.data.user_id,
          service_name: parsed.data.service_name,
          amount: parsed.data.amount,
          status: 'pending',
          payment_status: 'pending',
          admin_notes: parsed.data.admin_notes,
          current_milestone: 0,
          created_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) throw error;

      // Send email notification
      if (profile?.email) {
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${internalSecret}`,
            },
            body: JSON.stringify({
              type: 'admin_order_created',
              to: profile.email,
              creatorName: profile.name || 'Creator',
              orderId: order.id,
              serviceName: parsed.data.service_name,
              amount: parsed.data.amount,
              adminNote: parsed.data.admin_notes || null,
            }),
          });
        } catch (emailErr) {
          console.error('[create order email]', emailErr);
        }
      }

      addToast('Order created successfully', 'success');
      onCreated();
    } catch (e) {
      console.error('[create order]', e);
      addToast('Failed to create order', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-[#0d0d1a] border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/15">
            <h2 className="text-lg font-bold text-white">Create New Order</h2>
            <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Creator *</label>
              <select
                required
                value={form.user_id}
                onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition"
                data-testid="create-order-user-select"
              >
                <option value="" className="bg-gray-900">Select a creator...</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-gray-900">
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Service *</label>
              <select
                required
                value={form.service_name}
                onChange={(e) => setForm((f) => ({ ...f, service_name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition"
                data-testid="create-order-service-select"
              >
                <option value="" className="bg-gray-900">Select service...</option>
                {Object.keys(SERVICE_MILESTONES).map((s) => (
                  <option key={s} value={s} className="bg-gray-900">{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Amount (USD) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition placeholder-gray-600"
                data-testid="create-order-amount-input"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Admin Note <span className="text-gray-600">(optional)</span></label>
              <textarea
                rows={3}
                maxLength={1000}
                value={form.admin_notes}
                onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))}
                placeholder="Internal context for this order..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 resize-none placeholder-gray-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="create-order-submit-btn"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              {saving ? 'Creating...' : 'Create Order'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (e) {
      console.error('[fetch orders]', e);
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Client-side filtering
  const allServices = [...new Set(orders.map((o) => o.service_name).filter(Boolean))].sort();

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;
    const matchService = serviceFilter === 'all' || o.service_name === serviceFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q
      || (o.profiles?.name || '').toLowerCase().includes(q)
      || (o.id || '').toLowerCase().includes(q)
      || (o.service_name || '').toLowerCase().includes(q);
    return matchStatus && matchPayment && matchService && matchSearch;
  });

  const totalRev = filteredOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const paidRev = filteredOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const unpaidRev = totalRev - paidRev;

  function handleOrderUpdated(updated) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
    if (selectedOrder?.id === updated.id) setSelectedOrder((prev) => ({ ...prev, ...updated }));
  }

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Creator', 'Email', 'Service', 'Amount', 'Status', 'Payment Status', 'Created At'];
    const rows = filteredOrders.map(o => [
      `"${shortId(o.id)}"`,
      `"${(o.profiles?.name || 'Unknown').replace(/"/g, '""')}"`,
      `"${o.profiles?.email || ''}"`,
      `"${o.service_name}"`,
      o.amount || 0,
      `"${o.status}"`,
      `"${o.payment_status}"`,
      `"${new Date(o.created_at).toLocaleDateString()}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div data-testid="admin-orders-page" className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-semibold">
              {orders.length} total
            </span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-600 transition shadow-lg shadow-purple-500/20"
            data-testid="create-order-btn"
          >
            <FaPlus className="text-xs" /> Create New Order
          </button>
        </div>

        {/* ── Revenue Summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <FaDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
              <p className="text-white text-xl font-bold">${totalRev.toFixed(0)}</p>
            </div>
          </div>
          <div className="bg-white/5 border border-green-500/15 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <FaDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Paid Revenue</p>
              <p className="text-white text-xl font-bold">${paidRev.toFixed(0)}</p>
            </div>
          </div>
          <div className="bg-white/5 border border-yellow-500/15 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
              <FaDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pending Revenue</p>
              <p className="text-white text-xl font-bold">${unpaidRev.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-4 space-y-3">
          {/* Status tabs */}
          <div className="flex flex-wrap gap-2" role="tablist">
            {FILTER_TABS.map((tab) => {
              const count = tab === 'all' ? orders.length : orders.filter((o) => o.status === tab).length;
              const active = statusFilter === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200
                    ${active
                      ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300'
                      : 'bg-white/3 border border-transparent text-gray-400 hover:bg-white/8 hover:text-gray-200'
                    }`}
                  data-testid={`filter-${tab}-btn`}
                >
                  {tab !== 'all' && (
                    <span className={`w-2 h-2 rounded-full ${active ? statusMeta(tab).dot : 'bg-gray-600'}`} />
                  )}
                  {tab}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-purple-500/30 text-purple-300' : 'bg-white/8 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Service filter + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                placeholder="Search by creator name or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 placeholder-gray-600 transition"
                data-testid="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-sm text-white rounded-xl pl-4 pr-8 py-2.5 focus:outline-none focus:border-purple-500/50 transition appearance-none min-w-[140px]"
              >
                <option value="all" className="bg-gray-900">All Payments</option>
                <option value="paid" className="bg-gray-900">Paid</option>
                <option value="pending" className="bg-gray-900">Pending</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-sm text-white rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-purple-500/50 transition appearance-none min-w-[180px]"
                data-testid="service-filter-select"
              >
                <option value="all" className="bg-gray-900">All Services</option>
                {allServices.map((s) => (
                  <option key={s} value={s} className="bg-gray-900">{s}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-sm font-medium transition whitespace-nowrap"
            >
              <FaFileCsv className="text-purple-400" /> Export CSV
            </button>
          </div>
        </div>

        {/* ── Orders Table ── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl p-12 text-center text-gray-500">
            <FaSearch className="mx-auto mb-3 text-2xl opacity-30" />
            <p className="font-medium">No orders match your filters</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-purple-500/15 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[80px_1fr_1fr_80px_110px_110px_90px_60px] gap-4 px-5 py-3 border-b border-purple-500/10">
              {['Order ID', 'Creator', 'Service', 'Amount', 'Status', 'Payment', 'Date', ''].map((h) => (
                <div key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</div>
              ))}
            </div>

            {/* Table rows */}
            <div className="divide-y divide-purple-500/8">
              {filteredOrders.map((order) => {
                const sm2 = statusMeta(order.status);
                const pm2 = paymentMeta(order.payment_status);
                return (
                  <div
                    key={order.id}
                    className="hidden lg:grid grid-cols-[80px_1fr_1fr_80px_110px_110px_90px_60px] gap-4 px-5 py-4 items-center hover:bg-white/3 transition group"
                    data-testid={`order-row-${order.id}`}
                  >
                    {/* Order ID */}
                    <span className="text-gray-400 font-mono text-xs">#{shortId(order.id)}</span>

                    {/* Creator */}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{order.profiles?.name || 'Unknown'}</p>
                      <p className="text-gray-500 text-xs truncate">{order.profiles?.email || '—'}</p>
                    </div>

                    {/* Service */}
                    <span className="text-gray-300 text-sm truncate">{order.service_name}</span>

                    {/* Amount */}
                    <span className="text-purple-400 font-bold text-sm">{fmtAmount(order.amount)}</span>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${sm2.bg} ${sm2.color} w-fit`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sm2.dot}`} />
                      {order.status}
                    </span>

                    {/* Payment badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${pm2.bg} ${pm2.color} w-fit`}>
                      {order.payment_status}
                    </span>

                    {/* Date */}
                    <span className="text-gray-500 text-xs">{fmtDate(order.created_at)}</span>

                    {/* Actions */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-600/30 hover:border-purple-400/50 transition opacity-0 group-hover:opacity-100"
                      data-testid={`order-actions-btn-${order.id}`}
                    >
                      Open
                    </button>
                  </div>
                );
              })}

              {/* Mobile cards (sm/md) */}
              {filteredOrders.map((order) => {
                const sm3 = statusMeta(order.status);
                const pm3 = paymentMeta(order.payment_status);
                return (
                  <div
                    key={`mob-${order.id}`}
                    className="lg:hidden p-4 space-y-3"
                    data-testid={`order-card-${order.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-semibold">{order.service_name}</p>
                        <p className="text-xs text-gray-500 font-mono">#{shortId(order.id)}</p>
                      </div>
                      <p className="text-purple-400 font-bold">{fmtAmount(order.amount)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center">
                        <FaUser className="text-purple-400 text-[8px]" />
                      </div>
                      <div>
                        <p className="text-white text-sm">{order.profiles?.name || 'Unknown'}</p>
                        <p className="text-gray-500 text-xs">{order.profiles?.email || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${sm3.bg} ${sm3.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm3.dot}`} /> {order.status}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${pm3.bg} ${pm3.color}`}>
                        {order.payment_status}
                      </span>
                      <span className="text-gray-500 text-xs ml-auto">{fmtDate(order.created_at)}</span>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={handleOrderUpdated}
          addToast={addToast}
        />
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchOrders(); }}
          addToast={addToast}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} />
    </AdminLayout>
  );
}
