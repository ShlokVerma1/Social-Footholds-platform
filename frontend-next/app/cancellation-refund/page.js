'use client'

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const CancellationRefund = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <nav className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Social Footholds</Link>
            <Link href="/" className="text-gray-300 hover:text-white transition">Back to Home</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">Cancellation & Refund Policy</h1>
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>At Social Footholds, we aim to maintain fairness and transparency in our services. Orders can be cancelled within 7 days of purchase, provided the service has not been fully completed. If the service has not started or is in early stages, a full refund may be issued upon request.</p>
            <p>Once a service has been fully delivered, refunds are not applicable. In cases where partial work has been completed, a partial refund may be considered based on the extent of work done. Refund requests based on change of mind or dissatisfaction without valid reasoning will not be accepted.</p>
            <p>All approved refunds are processed within 5 to 10 business days. By purchasing our services, you agree to this refund policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefund;
