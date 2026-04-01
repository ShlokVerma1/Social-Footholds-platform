'use client'

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const PrivacyPolicy = () => {
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
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last Updated: [Add Date]</p>
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>At Social Footholds, we value your privacy and are committed to protecting your personal information. We may collect basic details such as your name, email address, and content or channel links to deliver our services effectively. This information is used strictly for service delivery, communication, and improving your experience.</p>
            <p>We do not sell, share, or rent your personal data to any third party under any circumstances. Your information remains secure and is only accessed when necessary to provide our services. We also do not ask for your passwords at any point. In cases where access is required, it is always limited, secure, and shared with your consent.</p>
            <p>We may use trusted third-party tools for payments, analytics, and communication, but your data remains protected at all times. You have full control over your data and can request access, updates, or deletion at any time by contacting us at{' '}
              <a href="mailto:team@socialfootholds.com" className="text-purple-400 hover:text-purple-300 underline">team@socialfootholds.com</a>.
            </p>
            <p>By using our services, you agree to this privacy policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
