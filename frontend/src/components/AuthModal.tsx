import React, { useState } from 'react';
import { User } from '../types';
import { ApiService } from '../services/api';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (tab === 'register') {
        const res = await ApiService.register({ name, email, password, role });
        if (!res.success) {
          throw new Error(res.error || 'Registration failed.');
        }
        // Auto-login after registration
        const loginRes = await ApiService.login({ email, password });
        if (loginRes.success && loginRes.token && loginRes.user) {
          onSuccess(loginRes.user, loginRes.token);
          onClose();
        }
      } else {
        const res = await ApiService.login({ email, password });
        if (!res.success || !res.token || !res.user) {
          throw new Error(res.error || 'Invalid email or password.');
        }
        onSuccess(res.user, res.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Dealership Access Portal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-900/40">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
              tab === 'login'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
              tab === 'register'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center space-x-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Demo Logins */}
          {tab === 'login' && (
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoUser('admin@dealership.com', 'admin123')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 text-left font-medium transition-colors"
                >
                  👑 Admin User
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoUser('customer@gmail.com', 'user123')}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/50 text-left font-medium transition-colors"
                >
                  👤 Customer User
                </button>
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name*</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Milan Tarsariya"
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address*</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-800 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password*</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
              >
                <option value="USER">Customer / Buyer (Default)</option>
                <option value="ADMIN">Dealership Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-95 mt-2"
          >
            {isSubmitting ? 'Authenticating...' : tab === 'login' ? 'Sign In to Account' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
