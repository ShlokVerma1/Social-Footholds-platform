'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = ({ isRoot }) => {
  const pathname = usePathname();

  if (isRoot && pathname) {
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/services') ||
      pathname.startsWith('/orders')
    ) {
      return null;
    }
  }

  return (
    <footer className="bg-black/50 border-t border-purple-500/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Social Footholds
            </h3>
            <p className="text-gray-400 text-sm">
              Empowering 25,000+ creators worldwide to reach millions of audiences globally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition text-sm">
                Home
              </Link>
              <a href="#services" className="block text-gray-400 hover:text-white transition text-sm">
                Products
              </a>
              <Link href="/blogs" className="block text-gray-400 hover:text-white transition text-sm">
                Blog
              </Link>
              <a href="#contact" className="block text-gray-400 hover:text-white transition text-sm">
                Contact Us
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link href="/privacy-policy" className="block text-gray-400 hover:text-white transition text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="block text-gray-400 hover:text-white transition text-sm">
                Terms & Conditions
              </Link>
              <Link href="/cancellation-refund" className="block text-gray-400 hover:text-white transition text-sm">
                Cancellation & Refund
              </Link>
              <Link href="/shipping-delivery" className="block text-gray-400 hover:text-white transition text-sm">
                Shipping & Delivery
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-purple-500/20 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Social Footholds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
