'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`
      transition-all duration-500 sticky top-0 z-50
      backdrop-blur-2xl saturate-150
      border-b
      ${scrolled
        ? 'bg-purple-950/20 border-purple-500/25 shadow-[0_4px_30px_rgba(168,85,247,0.12)]'
        : 'bg-white/[0.03] border-white/[0.06]'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className={`font-bold transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
            <span className="logo-shimmer">Social Footholds</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
            <a href="#services" className="text-gray-300 hover:text-white transition">
              Products
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition">
              Contact Us
            </a>
            <Link href="/login" className="text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10">
              Login
            </Link>
            <Link href="/register" className="btn-shimmer relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block text-gray-300 hover:text-white transition py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <a href="#services" className="block text-gray-300 hover:text-white transition py-2" onClick={() => setMobileMenuOpen(false)}>
              Products
            </a>
            <a href="#contact" className="block text-gray-300 hover:text-white transition py-2" onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </a>
            <Link href="/login" className="block text-gray-300 hover:text-white transition py-2" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="block btn-shimmer relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
