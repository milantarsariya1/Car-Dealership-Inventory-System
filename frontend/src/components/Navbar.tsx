import React from 'react';
import { Car, ShieldCheck, LogIn, LogOut, User as UserIcon, PlusCircle, LayoutDashboard } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
  activeTab: 'catalog' | 'admin';
  setActiveTab: (tab: 'catalog' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenAddModal,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              Apex<span className="gradient-text">Motors</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Car Dealership Inventory</p>
          </div>
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center space-x-3">
          <nav className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Catalog
            </button>
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </nav>

          {user?.role === 'ADMIN' && (
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Add Vehicle
            </button>
          )}

          {/* User Profile & Auth */}
          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-1">
                    {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors border border-transparent hover:border-rose-900/50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
