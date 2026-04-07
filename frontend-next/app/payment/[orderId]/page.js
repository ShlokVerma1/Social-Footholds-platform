'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CreatorLayout from '@/components/CreatorLayout';
import { orderAPI } from '@/lib/api';
import {
  FaCheckCircle, FaRocket, FaLock, FaClock,
  FaWhatsapp, FaEnvelope, FaChartLine, FaShieldAlt,
} from 'react-icons/fa';

const Payment = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
      </CreatorLayout>
    );
  }

  if (!order) return null;

  const shortId = String(order.id || '').slice(0, 8).toUpperCase();
  const amount = Number(order.amount || 0).toFixed(2);

  return (
    <CreatorLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── TOP: Order confirmed badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <FaCheckCircle className="text-green-400" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Order Confirmed</p>
            <p className="text-gray-500 text-sm">#{shortId} · We've received your request</p>
          </div>
        </motion.div>

        {/* ── Order Summary Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-7 rounded-3xl mb-6"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent" />

          <h2 className="text-white font-bold text-xl mb-5">Order Summary</h2>

          <div className="space-y-3 pb-5 mb-5 border-b border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Service</span>
              <span className="text-white font-semibold">{order.service_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Order ID</span>
              <span className="text-white font-mono text-sm">#{shortId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Status</span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold capitalize">
                {order.status || 'pending'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-base">Total Amount</span>
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              ${amount}
            </span>
          </div>
        </motion.div>

        {/* ── Payment Gateway Coming Soon ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-7 rounded-3xl mb-6"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-transparent" />

          {/* Coming Soon Banner */}
          <div className="flex flex-col items-center text-center py-6">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/20 border border-purple-500/30 flex items-center justify-center">
                <FaLock className="text-purple-400 text-3xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-black flex items-center justify-center">
                <FaClock className="text-black text-[10px]" />
              </div>
            </div>

            <h3 className="text-white font-bold text-2xl mb-2">Payment Gateway</h3>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-sm font-semibold">Coming Very Soon</span>
            </div>

            <p className="text-gray-400 max-w-md leading-relaxed text-sm">
              We're integrating a secure payment gateway and will be live within days.
              Your order is already <span className="text-purple-300 font-semibold">confirmed and saved</span>.
              Our team will reach out to you to arrange payment and kickstart your campaign.
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mt-2">
            <p className="text-white font-semibold text-sm mb-4">What happens next?</p>
            <div className="space-y-3">
              {[
                { icon: <FaCheckCircle className="text-green-400" />, text: 'Your order is saved and visible in your dashboard' },
                { icon: <FaEnvelope className="text-blue-400" />, text: 'Our team will email you within 24 hours with payment details' },
                { icon: <FaRocket className="text-purple-400" />, text: 'Campaign kicks off once payment is confirmed' },
                { icon: <FaChartLine className="text-pink-400" />, text: 'Track your campaign progress in the Monitor Growth tab' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Contact to Pay Now ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="service-card-border relative overflow-hidden backdrop-blur-xl p-7 rounded-3xl mb-6"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <FaShieldAlt className="text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Want to pay right now?</p>
              <p className="text-gray-400 text-sm mb-4">
                Contact us directly and we'll process your order immediately.
                Reference Order ID: <span className="text-purple-300 font-mono font-bold">#{shortId}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  <FaWhatsapp /> WhatsApp Us
                </a>
                <a
                  href={`mailto:team@socialfootholds.com?subject=Payment for Order %23${shortId}&body=Hi, I'd like to pay for Order %23${shortId} - ${order.service_name} ($${amount}).`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  <FaEnvelope /> Email Us
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Go to Dashboard ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white font-semibold text-sm transition"
          >
            <FaChartLine className="text-xs" /> Go to Dashboard
          </button>
        </motion.div>

      </div>
    </CreatorLayout>
  );
};

export default Payment;
