import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Info, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('tpo@university.edu.in');
  const [password, setPassword] = useState('Placement@2024');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Realistic role resolution
      const isDean = email.toLowerCase().includes('dean');
      const isFaculty = email.toLowerCase().includes('faculty');

      const user: User = {
        id: isDean ? 'USR-DEAN-01' : isFaculty ? 'USR-FAC-01' : 'USR-TPO-01',
        name: isDean ? 'Prof. K. Venkatesh (Dean Academics)' : isFaculty ? 'Dr. Meenakshi Rao (CSE Dept)' : 'Dr. Rajeshwar Sharma (TPO Head)',
        email: email.trim(),
        role: isDean ? 'Dean / Administrator' : isFaculty ? 'Department Faculty' : 'Placement Officer',
        collegeName: 'National Institute of Technology & Engineering',
      };

      onLoginSuccess(user);
    }, 400);
  };

  const handleQuickFill = (role: 'tpo' | 'dean' | 'faculty') => {
    if (role === 'tpo') {
      setEmail('tpo@university.edu.in');
      setPassword('Placement@2024');
    } else if (role === 'dean') {
      setEmail('dean@university.edu.in');
      setPassword('Academic@2024');
    } else {
      setEmail('faculty.cse@university.edu.in');
      setPassword('Faculty@2024');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="w-full max-w-md">
        {/* University Header Brand Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-20 h-20 mx-auto rounded-2xl p-1 bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 mb-4 flex items-center justify-center overflow-hidden">
              <img
                src="/src/assets/images/placement_cell_logo_1792730644831.jpg"
                alt="University Placement Cell"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              PlacementHQ Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Student Placement Data Analysis and Prediction System
            </p>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Staff Authentication
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sign in with authorized institutional credentials
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@university.edu.in"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-medium text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Remember my credentials
                  </span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>256-bit TLS</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Role Selector */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Fast Sign-In Pre-sets
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('tpo')}
                  className="px-2 py-1.5 text-[11px] font-medium bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 truncate"
                >
                  TPO Head
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('dean')}
                  className="px-2 py-1.5 text-[11px] font-medium bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 truncate"
                >
                  Dean
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('faculty')}
                  className="px-2 py-1.5 text-[11px] font-medium bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 truncate"
                >
                  Faculty
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          National Institute of Technology & Engineering · Training & Placement Cell
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Reset Security Credentials
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your registered university email to receive a password recovery link.
            </p>

            {forgotSuccess ? (
              <div className="my-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Recovery instructions dispatched to your mailbox!</span>
              </div>
            ) : (
              <div className="my-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@university.edu.in"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  onClick={() => {
                    if (forgotEmail.trim()) {
                      setForgotSuccess(true);
                    }
                  }}
                  className="px-3 py-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
