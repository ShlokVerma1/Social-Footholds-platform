'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';
import { FaHome, FaYoutube, FaMusic, FaSearch, FaFilm, FaMobileAlt, FaGlobe, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';

const CreatorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/services/video-promotion', icon: <FaYoutube />, label: 'Video Promotion' },
    { path: '/services/music-promotion', icon: <FaMusic />, label: 'Music Promotion' },
    { path: '/services/channel-seo', icon: <FaSearch />, label: 'Channel SEO' },
    { path: '/services/video-editing', icon: <FaFilm />, label: 'Video Editing' },
    { path: '/services/shorts-creation', icon: <FaMobileAlt />, label: 'Shorts' },
    { path: '/services/web-blogs', icon: <FaGlobe />, label: 'Web & Blogs' },
    { path: '/orders', icon: <FaShoppingBag />, label: 'My Orders' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">

      {/* ── TOP NAVBAR: Full glassmorphism matching landing page ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-2xl saturate-150 border-b ${
        scrolled
          ? 'bg-purple-950/25 border-purple-500/30 shadow-[0_4px_30px_rgba(168,85,247,0.15)]'
          : 'bg-white/[0.04] border-white/[0.08]'
      }`}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Footholds
            </Link>

            {/* User info + logout */}
            <div className="flex items-center gap-4">
              {/* User Avatar Badge */}
              <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-purple-500/20 rounded-full px-4 py-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <span className="text-gray-300 text-sm">Welcome, <span className="text-white font-semibold">{user?.name}</span></span>
              </div>
              <button
                onClick={async () => {
                  setIsLoggingOut(true);
                  await logout();
                }}
                disabled={isLoggingOut}
                className={`flex items-center gap-2 text-gray-400 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                data-testid="logout-button"
              >
                <FaSignOutAlt /> {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* ── SIDEBAR: Grain texture + animated active glow ── */}
        <aside className="grain-texture relative w-64 min-h-screen bg-gradient-to-b from-black/40 via-purple-950/20 to-black/40 backdrop-blur-xl border-r border-purple-500/20 p-4 overflow-hidden">

          {/* Decorative ambient glow behind sidebar */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-600/20 rounded-full blur-[60px] pointer-events-none" />

          {/* SVG accent: small geometric corner decoration */}
          <svg className="absolute top-2 right-2 w-16 h-16 opacity-10" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="32" cy="32" r="18" stroke="#ec4899" strokeWidth="0.5" />
          </svg>

          <nav className="space-y-1 relative z-10">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ x: 3 }}
                >
                  <Link
                    href={item.path}
                    className={`relative flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/80 to-purple-700/50 text-white border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    {/* Active left glow bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400 rounded-full" />
                    )}
                    {/* Active shimmer sweep inside sidebar item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmerSweep_3s_ease-in-out_infinite] pointer-events-none" />
                    )}
                    <span className={`text-base transition-all ${isActive ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom sidebar decoration */}
          <div className="absolute bottom-8 left-4 right-4">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-4" />
            <p className="text-xs text-gray-600 text-center">Social Footholds v1.0</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 p-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default CreatorLayout;
