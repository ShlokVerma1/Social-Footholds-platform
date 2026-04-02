'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';
import { FaTachometerAlt, FaUsers, FaShoppingBag, FaEnvelope, FaBlog, FaCog, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user?.name || '');

  // Track scroll for navbar glassmorphism transition
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep displayName in sync if user object updates
  React.useEffect(() => {
    if (user?.name) setDisplayName(user.name);
  }, [user?.name]);

  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-purple-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FaShieldAlt className="text-purple-400 text-lg" />
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/orders', icon: <FaShoppingBag />, label: 'Orders' },
    { path: '/admin/enquiries', icon: <FaEnvelope />, label: 'Enquiries' },
    { path: '/admin/blogs', icon: <FaBlog />, label: 'Blogs' },
    { path: '/admin/services', icon: <FaCog />, label: 'Services' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">

      {/* ── TOP NAVBAR: Glassmorphism with scroll transition ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-2xl saturate-150 border-b ${
        scrolled
          ? 'bg-purple-950/25 border-purple-500/30 shadow-[0_4px_30px_rgba(168,85,247,0.15)]'
          : 'bg-white/[0.04] border-white/[0.08]'
      }`}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <Link href="/admin/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Footholds Admin
            </Link>

            {/* Admin badge + logout */}
            <div className="flex items-center gap-4">
              {/* Admin avatar badge — click to open settings */}
              <button
                onClick={() => setSettingsOpen(true)}
                title="Account Settings"
                className="hidden sm:flex items-center gap-3 bg-white/5 border border-purple-500/20 rounded-full px-4 py-1.5 cursor-pointer hover:bg-white/10 hover:border-purple-500/40 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                  <FaShieldAlt className="text-[10px]" />
                </div>
                <span className="text-gray-300 text-sm">Admin: <span className="text-white font-semibold">{displayName}</span></span>
              </button>
              <button
                onClick={async () => {
                  setIsLoggingOut(true);
                  await logout();
                }}
                disabled={isLoggingOut}
                className={`flex items-center gap-2 text-gray-400 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                data-testid="admin-logout-button"
              >
                <FaSignOutAlt /> {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* ── SIDEBAR: Grain texture + animated active indicators ── */}
        <aside className="grain-texture relative w-64 min-h-screen bg-gradient-to-b from-black/40 via-purple-950/20 to-black/40 backdrop-blur-xl border-r border-purple-500/20 p-4 overflow-hidden">

          {/* Decorative ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />

          {/* SVG corner decoration */}
          <svg className="absolute top-2 right-2 w-16 h-16 opacity-10" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="32" cy="32" r="18" stroke="#f97316" strokeWidth="0.5" />
          </svg>

          {/* Admin badge */}
          <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
            <FaShieldAlt className="text-red-400 text-sm" />
            <span className="text-xs font-bold text-red-300 uppercase tracking-widest">Admin Panel</span>
          </div>

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
                        ? 'bg-gradient-to-r from-red-600/60 to-orange-600/40 text-white border border-red-400/30 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    {/* Active left glow bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 via-orange-400 to-red-400 rounded-full" />
                    )}
                    {/* Shimmer sweep on active item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmerSweep_3s_ease-in-out_infinite] pointer-events-none" />
                    )}
                    <span className={`text-base transition-all ${isActive ? 'text-red-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom decoration */}
          <div className="absolute bottom-8 left-4 right-4">
            <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent mb-4" />
            <p className="text-xs text-gray-600 text-center">Admin Panel v1.0</p>
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onNameUpdate={(newName) => setDisplayName(newName)}
      />
    </div>
  );
};

export default AdminLayout;
