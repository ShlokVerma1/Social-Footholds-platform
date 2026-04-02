'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaTimes, FaCheck, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

/* ─────────────────────────────────────────────────────────
   Input helper
───────────────────────────────────────────────────────── */
const Field = ({ label, id, type = 'text', value, onChange, placeholder, rightEl }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all pr-10"
      />
      {rightEl && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {rightEl}
        </span>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   Alert banner
───────────────────────────────────────────────────────── */
const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const styles = type === 'error'
    ? 'bg-red-500/10 border-red-500/30 text-red-300'
    : 'bg-green-500/10 border-green-500/30 text-green-300';
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 text-xs px-4 py-3 rounded-xl border ${styles}`}
    >
      {type === 'error'
        ? <FaTimes className="shrink-0" />
        : <FaCheck className="shrink-0" />}
      {msg}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   Profile Tab — Change display name
───────────────────────────────────────────────────────── */
const ProfileTab = ({ user, onNameUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Name cannot be empty.');
    if (trimmed === user?.name) return setError('This is already your current name.');

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: dbErr } = await supabase
        .from('profiles')
        .update({ name: trimmed })
        .eq('id', user.id);

      if (dbErr) throw dbErr;

      onNameUpdate(trimmed);
      setSuccess('Display name updated successfully!');
    } catch (err) {
      setError(err?.message || 'Failed to update name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <Alert type="error" msg={error} />
      <Alert type="success" msg={success} />

      <Field
        label="Display Name"
        id="settings-name"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(''); setSuccess(''); }}
        placeholder="Your display name"
      />

      <div className="text-xs text-gray-500">
        This name appears in the navigation bar and throughout your account.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_24px_rgba(168,85,247,0.5)]"
      >
        {loading ? <><FaSpinner className="animate-spin" /> Saving…</> : 'Save Name'}
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────────────────
   Security Tab — Change password
───────────────────────────────────────────────────────── */
const SecurityTab = () => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newPass) return setError('Please enter a new password.');
    if (newPass.length < 8) return setError('Password must be at least 8 characters.');
    if (newPass !== confirmPass) return setError('Passwords do not match.');

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: authErr } = await supabase.auth.updateUser({ password: newPass });
      if (authErr) throw authErr;

      setSuccess('Password updated! Check your email if confirmation is required.');
      setNewPass('');
      setConfirmPass('');
    } catch (err) {
      setError(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBtn = (show, setShow) => (
    <button
      type="button"
      onClick={() => setShow(s => !s)}
      className="text-gray-500 hover:text-gray-300 transition-colors"
      tabIndex={-1}
    >
      {show ? <FaEyeSlash /> : <FaEye />}
    </button>
  );

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <Alert type="error" msg={error} />
      <Alert type="success" msg={success} />

      <Field
        label="New Password"
        id="settings-new-pass"
        type={showNew ? 'text' : 'password'}
        value={newPass}
        onChange={(e) => { setNewPass(e.target.value); setError(''); setSuccess(''); }}
        placeholder="Min. 8 characters"
        rightEl={toggleBtn(showNew, setShowNew)}
      />

      <Field
        label="Confirm New Password"
        id="settings-confirm-pass"
        type={showConfirm ? 'text' : 'password'}
        value={confirmPass}
        onChange={(e) => { setConfirmPass(e.target.value); setError(''); setSuccess(''); }}
        placeholder="Re-enter new password"
        rightEl={toggleBtn(showConfirm, setShowConfirm)}
      />

      {/* Strength hint */}
      {newPass.length > 0 && (
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                newPass.length > i * 3 + 2
                  ? newPass.length >= 12 ? 'bg-green-500' : newPass.length >= 8 ? 'bg-yellow-500' : 'bg-red-500'
                  : 'bg-white/10'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            {newPass.length >= 12 ? 'Strong' : newPass.length >= 8 ? 'Good' : 'Weak'}
          </span>
        </div>
      )}

      <div className="text-xs text-gray-500">
        After saving, Supabase may send a confirmation email before the change takes effect.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_24px_rgba(168,85,247,0.5)]"
      >
        {loading ? <><FaSpinner className="animate-spin" /> Updating…</> : 'Update Password'}
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────────────────
   Main Modal
───────────────────────────────────────────────────────── */
const TABS = [
  { id: 'profile', label: 'Profile', icon: <FaUser /> },
  { id: 'security', label: 'Security', icon: <FaLock /> },
];

const SettingsModal = ({ isOpen, onClose, user, onNameUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Reset tab when modal re-opens
  useEffect(() => {
    if (isOpen) setActiveTab('profile');
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-md"
            style={{
              background: 'linear-gradient(135deg, rgba(30,18,60,0.97) 0%, rgba(20,12,45,0.99) 100%)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)' }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-bold text-white">Account Settings</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage your profile and security</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close settings"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 mx-6 mt-5 p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/60 text-white shadow-[0_2px_12px_rgba(168,85,247,0.3)]'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-6 pb-6 pt-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === 'profile' ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === 'profile' ? 12 : -12 }}
                  transition={{ duration: 0.18 }}
                >
                  {activeTab === 'profile'
                    ? <ProfileTab user={user} onNameUpdate={onNameUpdate} />
                    : <SecurityTab />
                  }
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
