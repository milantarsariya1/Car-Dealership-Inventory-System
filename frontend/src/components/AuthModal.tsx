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
  // Role is always USER — admin is a fixed seeded account only
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (tab === 'register') {
        const res = await ApiService.register({ name, email, password });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-manrope">
      <div className="glass-panel w-full max-w-md rounded-[20px] overflow-hidden border border-[#a484d7]/30 bg-[#1c1634] shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#a484d7]/20 flex items-center justify-between bg-[#130e26]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-[8px] bg-[#7b39fc]/20 text-[#a484d7]">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Dealership Access Portal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#a484d7]/20 bg-[#130e26]/60 font-cabin">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
              tab === 'login'
                ? 'border-[#7b39fc] text-[#a484d7] bg-[#1c1634]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
              tab === 'register'
                ? 'border-[#7b39fc] text-[#a484d7] bg-[#1c1634]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-inter">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-[10px] flex items-center space-x-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Demo Logins */}
          {tab === 'login' && (
            <div className="bg-[#130e26] p-3.5 rounded-[12px] border border-[#a484d7]/20 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-white/60 font-semibold font-cabin">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-cabin">
                <button
                  type="button"
                  onClick={() => fillDemoUser('admin@dealership.com', 'admin123')}
                  className="px-2.5 py-1.5 rounded-[8px] bg-emerald-950/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-left font-medium transition-colors"
                >
                  👑 Admin User
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoUser('customer@gmail.com', 'user123')}
                  className="px-2.5 py-1.5 rounded-[8px] bg-[#7b39fc]/20 hover:bg-[#7b39fc]/40 text-[#a484d7] border border-[#7b39fc]/40 text-left font-medium transition-colors"
                >
                  👤 Customer User
                </button>
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1 font-cabin">Full Name*</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Milan Tarsariya"
                  className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs pl-9 pr-3 py-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1 font-cabin">Email Address*</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs pl-9 pr-3 py-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1 font-cabin">Password*</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs pl-9 pr-3 py-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
              />
            </div>
          </div>

          {/* No role selection — all new accounts are Customer/Buyer by default.
              ApexMotors has a single pre-configured admin account. */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-[10px] text-xs font-semibold text-white bg-[#7b39fc] hover:bg-[#6826e3] shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01] active:scale-95 mt-2 font-cabin"
          >
            {isSubmitting ? 'Authenticating...' : tab === 'login' ? 'Sign In to Account' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
