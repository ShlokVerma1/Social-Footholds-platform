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
      {/* Native SVG Code - renders infinitely sharp without network requests */}
      {/* ========================================== */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none animated-mesh-bg overflow-hidden">
        
        {/* Floating Ring Geometry */}
        <motion.svg 
          viewBox="0 0 400 400" 
          className="absolute top-[5%] left-[-10%] md:left-[5%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-[0.15] drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-pink-500" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="4" className="text-purple-400 opacity-50" />
        </motion.svg>

        {/* Isometric Wireframe Polygon */}
        <motion.svg
          viewBox="0 0 300 300"
          className="absolute bottom-[10%] md:bottom-[5%] right-[-10%] md:right-[5%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-20 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]"
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        >
          <polygon points="150,20 280,95 280,245 150,320 20,245 20,95" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-500" />
          <polygon points="150,50 250,110 250,230 150,290 50,230 50,110" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="text-purple-500" />
          <line x1="150" y1="20" x2="150" y2="170" stroke="currentColor" strokeWidth="2" className="text-pink-500/50" />
          <line x1="280" y1="95" x2="150" y2="170" stroke="currentColor" strokeWidth="2" className="text-pink-500/50" />
          <line x1="20" y1="95" x2="150" y2="170" stroke="currentColor" strokeWidth="2" className="text-pink-500/50" />
          <circle cx="150" cy="170" r="4" fill="currentColor" className="text-white opacity-60" />
        </motion.svg>

        {/* Abstract Tech Triangles */}
        <motion.svg
          viewBox="0 0 400 400"
          className="absolute top-[40%] md:top-[30%] right-[10%] md:right-[20%] w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-10"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -15, 0], x: [0, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        >
          <polygon points="200,50 350,300 50,300" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-400" />
          <polygon points="200,100 300,270 100,270" fill="none" stroke="currentColor" strokeWidth="4" className="text-purple-500/40" />
          <circle cx="200" cy="50" r="3" fill="currentColor" className="text-indigo-300" />
          <circle cx="350" cy="300" r="3" fill="currentColor" className="text-indigo-300" />
          <circle cx="50" cy="300" r="3" fill="currentColor" className="text-indigo-300" />
        </motion.svg>

      </div>

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
                { icon: <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />, end: 100, suffix: '%', label: 'Satisfaction Rate' },
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
                          duration={stat.end === 25000 ? 2.5 : 2} 
                          enableScrollSpy 
                          scrollSpyOnce 
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
      <ServicesDeck />
      <SupportHub />

      {/* ========================================== */}
      {/* 5. FOOTER COMPONENT */}
      {/* ========================================== */}
      <Footer isRoot={true} />
    </div>
  );
};

export default LandingPage;
