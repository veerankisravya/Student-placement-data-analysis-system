import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { User } from '../types';
import placementCellLogo from '../assets/images/placement_cell_logo_1792730644831.jpg';

interface LoginProps {
  onLoginSuccess: (user: User, remember: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('tpo@university.edu.in');
  const [password, setPassword] = useState('Placement@2024');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const demoAccounts: Record<string, { password: string; user: User }> = {
    'tpo@university.edu.in': {
      password: 'Placement@2024',
      user: {
        id: 'USR-TPO-01',
        name: 'Dr. Rajeshwar Sharma (TPO Head)',
        email: 'tpo@university.edu.in',
        role: 'Placement Officer',
        collegeName: 'National Institute of Technology & Engineering',
      },
    },
    'dean@university.edu.in': {
      password: 'Academic@2024',
      user: {
        id: 'USR-DEAN-01',
        name: 'Prof. K. Venkatesh (Dean Academics)',
        email: 'dean@university.edu.in',
        role: 'Dean / Administrator',
        collegeName: 'National Institute of Technology & Engineering',
      },
    },
    'faculty.cse@university.edu.in': {
      password: 'Faculty@2024',
      user: {
        id: 'USR-FAC-01',
        name: 'Dr. Meenakshi Rao (CSE Dept)',
        email: 'faculty.cse@university.edu.in',
        role: 'Department Faculty',
        collegeName: 'National Institute of Technology & Engineering',
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);

    const account = demoAccounts[email.trim().toLowerCase()];
    if (!account || account.password !== password) {
      setIsLoading(false);
      setError('Invalid demo email or password.');
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(account.user, rememberMe);
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
                src={placementCellLogo}
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
            <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-200">
              Demo only: this client-side sign-in is not secure and must not be used with real student data.
            </div>
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
                    Keep me signed in on this device
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
              Password recovery is not available in this client-side demo. Contact your system administrator.
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
