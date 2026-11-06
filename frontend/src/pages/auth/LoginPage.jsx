import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to prefill demo credentials for quick testing
  const setDemoCredentials = (roleType) => {
    setError('');
    if (roleType === 'admin') {
      setEmail('admin@attendease.edu');
      setPassword(''); // User enters the password they set in .env
    } else if (roleType === 'faculty') {
      setEmail('faculty@attendease.edu');
      setPassword('');
    } else if (roleType === 'student') {
      setEmail('john@student.edu');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-indigo-50/30 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* College Logo & Crest */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-700 text-white shadow-xl shadow-brand-700/25 mb-3 border-2 border-white">
          <GraduationCap className="w-9 h-9" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-800 bg-brand-100/70 px-3 py-0.5 rounded-full border border-brand-200">
            Deemed to be University
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
            VIGNAN UNIVERSITY
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Vignan's Foundation for Science, Technology &amp; Research
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-white border border-purple-100 shadow-sm">
            <p className="text-xs font-semibold text-brand-900">
              Department of Artificial Intelligence &amp; Machine Learning (AIML)
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              3rd Year Portal &bull; Sections A, B &amp; C
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-purple-900/5 rounded-2xl border border-slate-200/80 sm:px-10">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">AttendEase Portal Login</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your Vignan university credentials to access attendance records.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@attendease.edu"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-md shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Fill Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="py-1.5 px-2 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('faculty')}
                className="py-1.5 px-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('student')}
                className="py-1.5 px-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
              >
                Student
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2.5">
              Enter the password set in your backend <code className="text-slate-600 font-mono">.env</code>.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          AttendEase System &copy; 2026. Secure Role-Based Academic Portal.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
