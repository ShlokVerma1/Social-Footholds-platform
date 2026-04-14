'use client'

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const TermsConditions = () => {
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
        <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>

        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>By using Social Footholds, you agree to our terms of service. We provide growth and promotion services for creators across platforms such as YouTube and Spotify, focusing on increasing reach, audience, and visibility through organic and platform-compliant methods.</p>
            <p>We do not promise fake or guaranteed numbers, as results may vary depending on content quality, audience response, and platform algorithms. Our goal is to deliver real and measurable growth, not artificial engagement. All services are carried out using ethical practices, and we strictly avoid bots or fake traffic.</p>
            <p>Users are responsible for providing accurate information and ensuring they have full rights to the content they submit. All payments must be made in advance, and pricing may change without prior notice. While we strive to deliver consistent results, we are not responsible for platform changes, algorithm updates, or any account-related actions taken by third-party platforms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
