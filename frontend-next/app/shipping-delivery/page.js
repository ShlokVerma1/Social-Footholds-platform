'use client'

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const ShippingDelivery = () => {
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
        <h1 className="text-4xl font-bold text-white mb-4">Shipping & Delivery Policy</h1>
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>Social Footholds provides digital services, and no physical products are shipped. All services are delivered online through platform engagement, content optimization, and performance updates.</p>
            <p>Services typically begin within 24 to 72 hours after order confirmation, and results may start becoming visible within 3 to 14 days depending on the selected service and platform conditions. Delivery is communicated through email or WhatsApp updates, along with performance reports when applicable.</p>
            <p>While we aim to deliver services within the expected timeframe, delays may occur due to platform changes, content review processes, or high demand. For any delivery-related queries, users can contact us at{' '}
              <a href="mailto:team@socialfootholds.com" className="text-purple-400 hover:text-purple-300 underline">team@socialfootholds.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
