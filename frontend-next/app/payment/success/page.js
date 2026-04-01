'use client'

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-purple-500/20">
          <FaCheckCircle className="text-7xl text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-400 mb-2">Your payment has been processed successfully.</p>
          <p className="text-gray-400 mb-2">Your order is now being reviewed and will begin processing shortly.</p>
          {sessionId && (
            <p className="text-gray-500 text-sm mb-8">Session: {sessionId.substring(0, 20)}...</p>
          )}
          
          <Link
            href="/orders"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition"
          >
            Go to My Orders
          </Link>

          <p className="text-gray-500 text-sm mt-6">
            You will receive a confirmation email with your order details.
          </p>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccess = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default PaymentSuccess;
