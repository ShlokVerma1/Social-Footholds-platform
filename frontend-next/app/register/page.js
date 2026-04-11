'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  // Combine country code + phone number for submission
  const phone = phoneNumber ? `${countryCode} ${phoneNumber}` : '';

  const COUNTRY_CODES = [
    { code: '+1',   label: '🇺🇸 +1 (US/CA)' },
    { code: '+44',  label: '🇬🇧 +44 (UK)' },
    { code: '+61',  label: '🇦🇺 +61 (AU)' },
    { code: '+64',  label: '🇳🇿 +64 (NZ)' },
    { code: '+971', label: '🇦🇪 +971 (UAE)' },
    { code: '+966', label: '🇸🇦 +966 (SA)' },
    { code: '+65',  label: '🇸🇬 +65 (SG)' },
    { code: '+60',  label: '🇲🇾 +60 (MY)' },
    { code: '+49',  label: '🇩🇪 +49 (DE)' },
    { code: '+33',  label: '🇫🇷 +33 (FR)' },
    { code: '+39',  label: '🇮🇹 +39 (IT)' },
    { code: '+34',  label: '🇪🇸 +34 (ES)' },
    { code: '+31',  label: '🇳🇱 +31 (NL)' },
    { code: '+46',  label: '🇸🇪 +46 (SE)' },
    { code: '+47',  label: '🇳🇴 +47 (NO)' },
    { code: '+45',  label: '🇩🇰 +45 (DK)' },
    { code: '+41',  label: '🇨🇭 +41 (CH)' },
    { code: '+43',  label: '🇦🇹 +43 (AT)' },
    { code: '+32',  label: '🇧🇪 +32 (BE)' },
    { code: '+351', label: '🇵🇹 +351 (PT)' },
    { code: '+353', label: '🇮🇪 +353 (IE)' },
    { code: '+81',  label: '🇯🇵 +81 (JP)' },
    { code: '+82',  label: '🇰🇷 +82 (KR)' },
    { code: '+86',  label: '🇨🇳 +86 (CN)' },
    { code: '+91',  label: '🇮🇳 +91 (IN)' },
    { code: '+55',  label: '🇧🇷 +55 (BR)' },
    { code: '+52',  label: '🇲🇽 +52 (MX)' },
    { code: '+54',  label: '🇦🇷 +54 (AR)' },
    { code: '+27',  label: '🇿🇦 +27 (ZA)' },
    { code: '+234', label: '🇳🇬 +234 (NG)' },
    { code: '+20',  label: '🇪🇬 +20 (EG)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name, phone);
      router.push('/dashboard');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 mb-8">Join 25,000+ creators growing their channels</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="John Doe"
                data-testid="register-name-input"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="your@email.com"
                data-testid="register-email-input"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-white/10 border border-purple-500/30 text-white px-3 py-3 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                  style={{ minWidth: '150px' }}
                  data-testid="register-country-code-select"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-gray-900 text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="e.g. 555 123 4567"
                  data-testid="register-phone-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
                data-testid="register-password-input"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
                data-testid="register-confirm-password-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition disabled:opacity-50"
              data-testid="register-submit-button"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
