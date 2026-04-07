'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';
import {
  FaArrowLeft, FaCheckCircle, FaSpinner, FaUser, FaCog,
  FaDollarSign, FaFileAlt, FaStickyNote, FaEnvelope,
  FaPlus, FaShoppingBag, FaTimesCircle,
} from 'react-icons/fa';

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------
function stripHtml(v) { return v.replace(/<[^>]*>/g, '').trim(); }

const createOrderSchema = z.object({
  user_id: z.string().uuid('Please select a valid creator'),
  service_id: z.string().uuid('Please select a valid service'),
  service_name: z.string().min(1),
  creator_email: z.string().email(),
  creator_name: z.string().min(1),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0')
    .multipleOf(0.01, 'Max 2 decimal places'),
  order_details: z
    .string()
    .min(1, 'Campaign details are required')
    .max(2000, 'Campaign details must be 2000 characters or fewer')
    .transform(stripHtml),
  admin_note: z
    .string()
    .max(1000, 'Admin note must be 1000 characters or fewer')
    .transform(stripHtml),
  client_note: z
    .string()
    .max(1000, 'Client note must be 1000 characters or fewer')
    .transform(stripHtml),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-red-400 text-xs">
      <FaTimesCircle className="shrink-0" /> {msg}
    </p>
  );
}

function CharCount({ value, max }) {
  const len = value.length;
  const near = len > max * 0.85;
  return (
    <span className={`text-xs ${near ? (len >= max ? 'text-red-400' : 'text-amber-400') : 'text-gray-600'}`}>
      {len}/{max}
    </span>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-purple-400 text-sm">{icon}</span>
      <label className="text-sm font-medium text-gray-300">{children}</label>
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 placeholder-gray-600 transition';

const selectCls =
  'w-full bg-[#0d0d1a] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition appearance-none';

const textareaCls =
  'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 placeholder-gray-600 resize-none transition';

// ---------------------------------------------------------------------------
// Success screen
// ---------------------------------------------------------------------------
function SuccessScreen({ orderId, onCreateAnother }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
        <FaCheckCircle className="text-green-400 text-3xl" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Order Created!</h2>
      <p className="text-gray-400 text-sm mb-1">The campaign has been created and the creator has been notified.</p>
      <p className="text-gray-600 text-xs font-mono mb-8">
        Order ID: <span className="text-purple-400">#{String(orderId).slice(0, 8)}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/admin/orders"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-600 transition shadow-lg shadow-purple-500/20"
          data-testid="go-to-orders-btn"
        >
          <FaShoppingBag className="text-xs" /> Go to Orders
        </Link>
        <button
          onClick={onCreateAnother}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-purple-500/20 text-purple-300 font-semibold text-sm hover:bg-white/10 hover:border-purple-400/40 transition"
          data-testid="create-another-btn"
        >
          <FaPlus className="text-xs" /> Create Another
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function AdminCreateOrderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Data
  const [creators, setCreators] = useState([]);
  const [services, setServices] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Form state
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [orderDetails, setOrderDetails] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [clientNote, setClientNote] = useState('');

  // UI state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);
  const [globalError, setGlobalError] = useState('');

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  // Fetch creators + services in parallel
  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [{ data: profileData }, { data: serviceData }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, name, email')
          .eq('role', 'creator')
          .order('name'),
        supabase
          .from('services')
          .select('id, name, base_price')
          .order('name'),
      ]);
      setCreators(profileData || []);
      setServices(serviceData || []);
    } catch (e) {
      console.error('[create order] fetch data error:', e);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-populate amount from service base_price
  useEffect(() => {
    if (!selectedServiceId) return;
    const svc = services.find((s) => s.id === selectedServiceId);
    if (svc?.base_price != null) setAmount(String(svc.base_price));
  }, [selectedServiceId, services]);

  function resetForm() {
    setSelectedCreatorId('');
    setSelectedServiceId('');
    setAmount('');
    setOrderDetails('');
    setAdminNote('');
    setClientNote('');
    setErrors({});
    setGlobalError('');
    setSuccessOrderId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setGlobalError('');

    const creator = creators.find((c) => c.id === selectedCreatorId);
    const service = services.find((s) => s.id === selectedServiceId);

    const raw = {
      user_id: selectedCreatorId,
      service_id: selectedServiceId,
      service_name: service?.name || '',
      creator_email: creator?.email || '',
      creator_name: creator?.name || '',
      amount: parseFloat(amount),
      order_details: orderDetails,
      admin_note: adminNote,
      client_note: clientNote,
    };

    const parsed = createOrderSchema.safeParse(raw);
    if (!parsed.success) {
      const errs = {};
      parsed.error.errors.forEach((er) => { errs[er.path[0]] = er.message; });
      setErrors(errs);
      return;
    }

    const d = parsed.data;
    const newId = crypto.randomUUID();

    setSubmitting(true);
    try {
      // 1. Insert order
      const { error: insertError } = await supabase
        .from('orders')
        .insert({
          id: newId,
          user_id: d.user_id,
          service_id: d.service_id,
          service_name: d.service_name,
          details: { description: d.order_details },
          amount: d.amount,
          status: 'processing',
          payment_status: 'pending',
          admin_notes: d.admin_note,
          client_notes: d.client_note,
          current_milestone: 0,
          milestones: [],
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      // 2. Send email notification
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_SECRET}`,
          },
          body: JSON.stringify({
            type: 'admin_order_created',
            to: d.creator_email,
            creatorName: d.creator_name,
            orderId: newId,
            serviceName: d.service_name,
            amount: d.amount,
            adminNote: d.client_note || null,
          }),
        });
      } catch (emailErr) {
        console.error('[create order] email send failed:', emailErr);
        // Non-fatal — order is already created
      }

      setSuccessOrderId(newId);
    } catch (err) {
      console.error('[create order] submit error:', err);
      setGlobalError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Guard states ──
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6" data-testid="create-order-page">

        {/* ── Back button + Page title ── */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition px-3 py-2 rounded-lg hover:bg-white/5"
            data-testid="back-to-orders-link"
          >
            <FaArrowLeft className="text-xs" /> Back to Orders
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create New Order</h1>
          <p className="text-gray-500 text-sm mt-1">Create a campaign on behalf of any creator.</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/5 border border-purple-500/15 rounded-2xl overflow-hidden">

          {/* Card header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-500/10 bg-white/[0.02]">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <FaPlus className="text-purple-400 text-xs" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">New Campaign</p>
              <p className="text-gray-600 text-xs">All fields marked * are required</p>
            </div>
          </div>

          {/* ── Success screen ── */}
          {successOrderId ? (
            <SuccessScreen orderId={successOrderId} onCreateAnother={resetForm} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">

              {/* Global error */}
              {globalError && (
                <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
                  <FaTimesCircle className="shrink-0 mt-0.5" />
                  {globalError}
                </div>
              )}

              {/* ── Select Creator ── */}
              <div>
                <SectionLabel icon={<FaUser />}>Select Creator *</SectionLabel>
                {dataLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm px-4 py-2.5">
                    <FaSpinner className="animate-spin text-xs" /> Loading creators...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      required
                      value={selectedCreatorId}
                      onChange={(e) => {
                        setSelectedCreatorId(e.target.value);
                        setErrors((prev) => ({ ...prev, user_id: undefined }));
                      }}
                      className={selectCls}
                      data-testid="creator-select"
                    >
                      <option value="" disabled className="bg-gray-900 text-gray-500">
                        — Select a creator —
                      </option>
                      {creators.map((c) => (
                        <option key={c.id} value={c.id} className="bg-gray-900">
                          {c.name} · {c.email}
                        </option>
                      ))}
                    </select>
                    {/* Preview chip */}
                    {selectedCreatorId && (() => {
                      const c = creators.find((x) => x.id === selectedCreatorId);
                      return c ? (
                        <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-500/20 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-purple-600/30 flex items-center justify-center text-xs font-bold text-purple-300">
                            {c.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-white text-xs font-medium">{c.name}</p>
                            <p className="text-gray-500 text-[11px] flex items-center gap-1">
                              <FaEnvelope className="text-[9px]" /> {c.email}
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
                <FieldError msg={errors.user_id} />
              </div>

              {/* ── Select Service ── */}
              <div>
                <SectionLabel icon={<FaCog />}>Select Service *</SectionLabel>
                {dataLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm px-4 py-2.5">
                    <FaSpinner className="animate-spin text-xs" /> Loading services...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      required
                      value={selectedServiceId}
                      onChange={(e) => {
                        setSelectedServiceId(e.target.value);
                        setErrors((prev) => ({ ...prev, service_id: undefined }));
                      }}
                      className={selectCls}
                      data-testid="service-select"
                    >
                      <option value="" disabled className="bg-gray-900 text-gray-500">
                        — Select a service —
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id} className="bg-gray-900">
                          {s.name}{s.base_price != null ? ` · $${Number(s.base_price).toFixed(2)}` : ''}
                        </option>
                      ))}
                    </select>
                    {selectedServiceId && (() => {
                      const s = services.find((x) => x.id === selectedServiceId);
                      return s ? (
                        <div className="mt-2 flex items-center justify-between px-3 py-2 bg-purple-600/10 border border-purple-500/20 rounded-lg">
                          <p className="text-white text-xs font-medium">{s.name}</p>
                          {s.base_price != null && (
                            <p className="text-purple-400 text-xs font-bold">
                              Base: ${Number(s.base_price).toFixed(2)}
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
                <FieldError msg={errors.service_id} />
              </div>

              {/* ── Amount ── */}
              <div>
                <SectionLabel icon={<FaDollarSign />}>Amount (USD) *</SectionLabel>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                    }}
                    placeholder="0.00"
                    className={`${inputCls} pl-8`}
                    data-testid="amount-input"
                  />
                </div>
                <FieldError msg={errors.amount} />
              </div>

              {/* ── Order Details ── */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <SectionLabel icon={<FaFileAlt />}>Campaign Details *</SectionLabel>
                  <CharCount value={orderDetails} max={2000} />
                </div>
                <textarea
                  rows={5}
                  required
                  maxLength={2000}
                  value={orderDetails}
                  onChange={(e) => {
                    setOrderDetails(e.target.value);
                    setErrors((prev) => ({ ...prev, order_details: undefined }));
                  }}
                  placeholder="Describe what the creator wants from this campaign — goals, target audience, platform, content type, links, etc."
                  className={textareaCls}
                  data-testid="order-details-input"
                />
                <FieldError msg={errors.order_details} />
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

              {/* ── Admin Note ── */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <SectionLabel icon={<FaStickyNote />}>
                      Internal Admin Note
                      <span className="ml-1.5 text-xs font-normal text-gray-600">(creator won't see this)</span>
                    </SectionLabel>
                  </div>
                  <CharCount value={adminNote} max={1000} />
                </div>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={adminNote}
                  onChange={(e) => {
                    setAdminNote(e.target.value);
                    setErrors((prev) => ({ ...prev, admin_note: undefined }));
                  }}
                  placeholder="Internal context, special instructions, pricing rationale..."
                  className={textareaCls}
                  data-testid="admin-note-input"
                />
                <FieldError msg={errors.admin_note} />
              </div>

              {/* ── Client Note ── */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <SectionLabel icon={<FaEnvelope />}>
                      Client Note
                      <span className="ml-1.5 text-xs font-normal text-gray-600">(visible to creator — sent in email)</span>
                    </SectionLabel>
                  </div>
                  <CharCount value={clientNote} max={1000} />
                </div>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={clientNote}
                  onChange={(e) => {
                    setClientNote(e.target.value);
                    setErrors((prev) => ({ ...prev, client_note: undefined }));
                  }}
                  placeholder="A welcome message or campaign overview for the creator..."
                  className={`${textareaCls} border-purple-500/20 focus:border-purple-500/50`}
                  data-testid="client-note-input"
                />
                <FieldError msg={errors.client_note} />
              </div>

              {/* ── Submit ── */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting || dataLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-600 transition shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  data-testid="submit-create-order-btn"
                >
                  {submitting
                    ? <><FaSpinner className="animate-spin" /> Creating Order...</>
                    : <><FaPlus className="text-xs" /> Create Order</>
                  }
                </button>
                <Link
                  href="/admin/orders"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold text-sm hover:bg-white/10 hover:text-gray-200 transition"
                  data-testid="cancel-link"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
