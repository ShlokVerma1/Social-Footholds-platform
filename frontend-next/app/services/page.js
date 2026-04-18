import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import AnimatedBackground from '@/components/landing/AnimatedBackground';
import { servicesData } from '@/constants/data';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

export const metadata = {
  title: 'Our Services | Social Foothold LLC',
  description: 'Explore our premium digital growth services including YouTube Video Promotion, Music Promotion on Spotify, Channel SEO Optimization, and more. Reach millions with organic strategies.',
  keywords: 'YouTube Video Promotion, Music Promotion, Spotify Promotion, Channel SEO, Video Editing, Shorts Creation, Web Design, Blogs, Social Foothold',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen relative overflow-clip">
      {/* GLOBAL AMBIENT BACKGROUND */}
      <AnimatedBackground />

      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">Our Premium Services</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive growth solutions designed to amplify your content, reach new audiences, and build a loyal fanbase. Explore our specialized services below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesData.map((service, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                    {service.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{service.name}</h2>
                </div>
                
                <p className="text-gray-400 mb-8 flex-grow leading-relaxed">
                  {service.detailedDescription}
                </p>
                
                <ul className="space-y-4 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-200 flex items-start text-sm font-medium">
                      <FaCheckCircle className="text-green-400 mr-3 mt-1 min-w-[16px]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/register"
                  className="mt-auto inline-flex items-center font-bold text-purple-400 hover:text-pink-300 transition-all duration-300 hover:translate-x-2"
                >
                  Start Growing Now <FaArrowRight className="ml-2" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 p-10 rounded-3xl text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Not sure which service is right for you?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Our experts can analyze your channel and recommend the best growth strategy tailored to your specific needs.
            </p>
            <Link 
              href="/#contact" 
              className="btn-shimmer relative overflow-hidden inline-block bg-white text-purple-900 px-8 py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
