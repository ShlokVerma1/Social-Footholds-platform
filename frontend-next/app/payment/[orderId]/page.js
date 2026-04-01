'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import CreatorLayout from '@/components/CreatorLayout';
import { orderAPI, paymentAPI } from '@/lib/api';
import { FaCheckCircle, FaLock } from 'react-icons/fa';

const Payment = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(orderId);
      setOrder(response.data);
      
      // If already paid, show success
      if (response.data.payment_status === 'paid') {
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Order not found');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await paymentAPI.createCheckoutSession(orderId);
      // Redirect to Stripe Checkout
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </CreatorLayout>
    );
  }

  if (paymentSuccess) {
    return (
      <CreatorLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-purple-500/20">
            <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-gray-400 mb-2">Your order has been confirmed.</p>
            <p className="text-gray-500 text-sm mb-6">Order #{order.id.substring(0, 8)}</p>
            <button
              onClick={() => router.push('/orders')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition"
            >
              Go to My Orders
            </button>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="max-w-3xl mx-auto" data-testid="payment-page">
        <h1 className="text-4xl font-bold text-white mb-8">Complete Payment</h1>

        {/* Order Summary */}
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6 pb-6 border-b border-purple-500/20">
            <div className="flex justify-between">
              <span className="text-gray-400">Service</span>
              <span className="text-white font-semibold">{order.service_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Order ID</span>
              <span className="text-white font-mono">#{order.id.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date</span>
              <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xl text-gray-300">Total Amount</span>
            <span className="text-4xl font-bold text-purple-400" data-testid="payment-amount">${order.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
          
          <div className="bg-purple-600/20 border border-purple-500/50 text-purple-300 p-4 rounded-lg mb-6">
            <p className="flex items-center gap-2 font-semibold mb-1">
              <FaLock className="text-sm" /> Secure Checkout via Stripe
            </p>
            <p className="text-sm text-gray-400">You will be redirected to Stripe's secure payment page to complete your purchase.</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition disabled:opacity-50"
            data-testid="confirm-pay-button"
          >
            {processing ? 'Redirecting to Stripe...' : `Confirm & Pay $${order.amount.toFixed(2)}`}
          </button>

          <p className="text-gray-500 text-center mt-4 text-sm">
            Payments are processed securely by Stripe. We never store your card details.
          </p>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default Payment;
