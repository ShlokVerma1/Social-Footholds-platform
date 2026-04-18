'use client'

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const timeoutRef              = useRef(null);

  const supabase = createClient();
  const router   = useRouter();

  // Always resets the loading state and clears safety timeout
  const stopLoading = (errMsg = '') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    if (errMsg) setError(errMsg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ── Safety net: if nothing resolves in 12s, unblock the UI ──────────
    timeoutRef.current = setTimeout(() => {
      stopLoading('Request timed out. Please check your connection and try again.');
    }, 12000);

    try {
      // Step 1: Authenticate
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        stopLoading('Invalid email or password. Please try again.');
        return;
      }

      // Step 2: Guard — user object must exist
      const user = authData?.user;
      if (!user) {
        // Email not confirmed or unknown Supabase issue
        stopLoading('Your account may not be verified. Please check your email for a confirmation link.');
        return;
      }

      // Step 3: Fetch profile role using maybeSingle (never throws on 0 rows)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();           // ← safe: returns null if no row, never throws

      if (profileError) {
        // RLS or network error on profile fetch
        await supabase.auth.signOut();
        stopLoading(`Could not verify admin access. (${profileError.message})`);
        return;
      }

      // Step 4: Check role
      if (profile?.role === 'admin') {
        // Navigate — loading stays true to prevent double-clicks; cleared by timeout
        router.push('/admin/dashboard');
        // Fallback: clear spinner after 6s in case navigation stalls
        timeoutRef.current = setTimeout(() => setLoading(false), 6000);
      } else {
        await supabase.auth.signOut();
        stopLoading(
          profile
            ? 'Access denied. This account does not have admin privileges.'
            : 'Admin profile not found. Please contact the system administrator.'
        );
      }
    } catch (err) {
      console.error('Admin login error:', err);
      stopLoading('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-2">
            <FaShieldAlt className="text-purple-400 text-2xl" />
            <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          </div>
          <p className="text-gray-400 mb-8">Access the admin dashboard</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-sm leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="admin@socialfootholds.com"
                data-testid="admin-email-input"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
                data-testid="admin-password-input"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              data-testid="admin-login-button"
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Verifying...' : 'Login as Admin'}
            </button>
          </form>
        </div>

        {/* Debug hint — only shown during loading */}
        {loading && (
          <p className="text-center text-gray-600 text-xs mt-4">
            Connecting to authentication server…
          </p>
        )}
      </div>
    </div>
  );
}
