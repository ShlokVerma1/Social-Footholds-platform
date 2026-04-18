'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaUsers, FaGlobeAmericas, FaCheckCircle } from 'react-icons/fa';
import CountUp from 'react-countup';
import { TypeAnimation } from 'react-type-animation';

// ==========================================
// MODULAR COMPONENTS
// These were extracted to prevent this file from becoming a 700+ line monolith.
// ==========================================
import Navbar from '@/components/landing/Navbar';
import ServicesDeck from '@/components/landing/ServicesDeck';
import SupportHub from '@/components/landing/SupportHub';
import BusinessExplanation from '@/components/landing/BusinessExplanation';
import Reviews from '@/components/landing/Reviews';
import AnimatedBackground from '@/components/landing/AnimatedBackground';
import Footer from '@/components/Footer';

const LandingPage = () => {
  // State for the 3D Stats Carousel in the Hero Section
  const [carouselRadius, setCarouselRadius] = useState(350);
  const [particles, setParticles] = useState([]);

  // Adjust hero carousel size on mobile
  useEffect(() => {
    const handleResize = () => setCarouselRadius(window.innerWidth < 768 ? 200 : 350);
    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize interactive particles only on the client to avoid hydration mismatch
  useEffect(() => {
    setParticles([
      { id: 0, width: 5, height: 5, top: 20, left: 15, duration: 25, delay: 0 },
      { id: 1, width: 7, height: 7, top: 65, left: 75, duration: 28, delay: -5 },
      { id: 2, width: 4, height: 4, top: 40, left: 55, duration: 22, delay: -10 },
      { id: 3, width: 6, height: 6, top: 80, left: 25, duration: 30, delay: -8 },
      { id: 4, width: 5, height: 5, top: 30, left: 88, duration: 26, delay: -15 },
      { id: 5, width: 8, height: 8, top: 55, left: 40, duration: 24, delay: -3 },
    ])
  }, []);

  return (
    <div className="min-h-screen relative overflow-clip">
      
      {/* ========================================== */}
      {/* 1. GLOBAL AMBIENT BACKGROUND */}
      {/* ========================================== */}
      <AnimatedBackground />

      {/* ========================================== */}
      {/* 2. NAVIGATION BAR */}
      {/* ========================================== */}
      <Navbar />

      {/* ========================================== */}
      {/* 3. HERO SECTION */}
      {/* ========================================== */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(236,72,153,0.4) 50%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />
        </div>

        {/* Floating Particles */}
        {particles.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: p.width,
                  height: p.height,
                  top: `${p.top}%`,
                  left: `${p.left}%`,
                  background: 'rgba(168, 85, 247, 0.4)',
                  boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)',
                  animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl md:text-7xl font-bold text-white mb-6" data-testid="hero-heading"
          >
            Grow Your Channel,
            <br />
            <TypeAnimation
              sequence={[
                'Reach Millions',
                2000,
                'Grow Faster',
                2000,
                'Dominate Your Niche',
                2000,
                'Build Your Empire',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Join 25,000+ creators worldwide who trust us to amplify their content and reach millions of audiences globally
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
              <Link href="/register" className="btn-shimmer relative overflow-hidden inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition transform hover:scale-105" data-testid="hero-cta-button">
                Start Growing Now <FaArrowRight className="inline ml-2" />
              </Link>
            </motion.div>
            <a href="#services" className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition">
              Explore Services
            </a>
          </motion.div>

          {/* Stats Interactive 3D Carousel */}
          <div className="relative h-[300px] w-full flex items-center justify-center mt-20 z-10" style={{ perspective: '1200px' }}>
            <div
              className="w-[280px] md:w-[320px] h-[220px] absolute carousel-spin"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {[
                { icon: <FaUsers className="text-5xl text-purple-400 mx-auto mb-4" />, end: 25000, suffix: '+', label: 'Creators Worldwide' },
                { icon: <FaGlobeAmericas className="text-5xl text-pink-400 mx-auto mb-4" />, end: 1, suffix: 'B+', label: 'Audience Reached' },
                { icon: <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />, end: 99, suffix: '%', label: 'Satisfaction Rate' },
              ].map((stat, index) => {
                const rotateY = index * 120;
                return (
                  <motion.div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300"
                    style={{
                      transform: `rotateY(${rotateY}deg) translateZ(${carouselRadius}px)`,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-purple-500/30 w-full h-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 hover:border-purple-500/70 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] cursor-pointer">
                      {stat.icon}
                      <h3 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                        <CountUp 
                          end={stat.end} 
                          duration={1.2} 
                          suffix={stat.suffix} 
                          separator="," 
                        />
                      </h3>
                      <p className="text-gray-300 font-medium text-lg">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. MODULARIZED SECTIONS */}
      {/* ========================================== */}
      <BusinessExplanation />
      <ServicesDeck />
      <Reviews />
      <SupportHub />

      {/* ========================================== */}
      {/* 5. FOOTER COMPONENT */}
      {/* ========================================== */}
      <Footer isRoot={true} />
    </div>
  );
};

export default LandingPage;
