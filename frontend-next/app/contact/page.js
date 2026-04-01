'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { enquiryAPI } from '@/lib/api';

const Contact = () => {
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', message: '', service: '', channel_link: '' });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const services = [
    'Video Promotion',
    'Music Promotion',
    'Channel SEO',
    'Video Editing',
    'Shorts Creation',
    'Web & Blogs'
  ];

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await enquiryAPI.create(enquiryForm);
      setEnquirySubmitted(true);
      setEnquiryForm({ name: '', email: '', message: '', service: '', channel_link: '' });
      setTimeout(() => setEnquirySubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Footholds
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 mb-12">Get in touch with our team. We're here to help!</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            {enquirySubmitted && (
              <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
                ✓ Thank you! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <select
                  value={enquiryForm.service}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, service: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="" className="bg-gray-900">Select a Service (Optional)</option>
                  {services.map((service, idx) => (
                    <option key={idx} value={service} className="bg-gray-900">{service}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="url"
                  placeholder="Your Channel/Video Link (Optional)"
                  value={enquiryForm.channel_link}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, channel_link: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  required
                  rows="5"
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-purple-400 text-xl mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">Content will be added soon</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaPhone className="text-purple-400 text-xl mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">Content will be added soon</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-purple-400 text-xl mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white">Content will be added soon</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-300">
                <p>Content will be added soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
