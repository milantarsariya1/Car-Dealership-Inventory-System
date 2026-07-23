import React, { useState } from 'react';
import { ChevronDown, Menu, X, LogOut, ShieldCheck, User as UserIcon, PlusCircle, LayoutDashboard, CarFront, Users } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
  activeTab: 'catalog' | 'inventory' | 'admin' | 'users' | 'profile' | 'checkout';
  setActiveTab: (tab: 'catalog' | 'inventory' | 'admin' | 'users' | 'profile' | 'checkout') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenAddModal,
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <header className="relative z-20 w-full bg-transparent px-6 lg:px-[120px] py-[16px] font-manrope">
      <div className="w-full flex items-center justify-between">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.04356 6.35771L13.6437 0.666504C14.0754 0.471504 14.5681 0.471504 14.9998 0.666504L27.5999 6.35771C28.2435 6.64831 28.6565 7.28471 28.6565 7.98971V19.3437C28.6565 20.0487 28.2435 20.6851 27.5999 20.9757L14.9998 26.6669C14.5681 26.8619 14.0754 26.8619 13.6437 26.6669L1.04356 20.9757C0.399961 20.6851 -0.0130386 20.0487 -0.0130386 19.3437V7.98971C-0.0130386 7.28471 0.399961 6.64831 1.04356 6.35771Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1">
              Apex<span className="text-[#7b39fc]">Motors</span>
            </span>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop Only) */}
        <nav className="hidden lg:flex items-center space-x-8 text-[14px] font-medium text-white">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`hover:opacity-80 transition-opacity ${activeTab === 'catalog' ? 'opacity-100 font-semibold underline underline-offset-4 decoration-[#7b39fc]' : 'opacity-90'}`}
          >
            Home
          </button>

          <div className="relative">
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              Services
              <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#2b2344] border border-[#a484d7]/30 rounded-lg shadow-xl py-2 z-50">
                <button
                  onClick={() => { setActiveTab('inventory'); setServicesDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#7b39fc]/30 transition-colors flex items-center gap-2"
                >
                  <CarFront className="w-3.5 h-3.5 text-[#a484d7]" />
                  Full Fleet Inventory
                </button>
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => { setActiveTab('admin'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#7b39fc]/30 transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#a484d7]" />
                    Admin Management
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`hover:opacity-80 transition-opacity ${activeTab === 'inventory' ? 'opacity-100 font-semibold underline underline-offset-4 decoration-[#7b39fc]' : 'opacity-90'}`}
          >
            Inventory
          </button>
          
          <a href="#contact" className="hover:opacity-80 transition-opacity">
            Contact us
          </a>
        </nav>

        {/* Right: Action Buttons (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-3">
          {user?.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveTab('users')}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-[8px] font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'users'
                    ? 'bg-[#7b39fc] text-white shadow-[0_0_15px_rgba(123,57,252,0.4)]'
                    : 'bg-transparent text-[#a484d7] hover:bg-[#7b39fc]/10 border border-[#a484d7]/30'
                }`}
              >
                <Users className="w-4 h-4" />
                User DB
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-[8px] font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'admin'
                    ? 'bg-[#7b39fc] text-white shadow-[0_0_15px_rgba(123,57,252,0.4)]'
                    : 'bg-transparent text-[#a484d7] hover:bg-[#7b39fc]/10 border border-[#a484d7]/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </button>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 rounded-[8px] text-[14px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Add Vehicle
            </button>
          )}

          {user ? (
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-3 bg-[#2b2344]/80 border border-[#a484d7]/40 px-3.5 py-1.5 rounded-[8px] cursor-pointer hover:bg-[#392e5a] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#7b39fc] flex items-center justify-center text-white font-bold text-xs">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-semibold text-white leading-tight">{user.name}</p>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a484d7] flex items-center gap-1">
                  {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                  {user.role}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onLogout(); }}
                title="Logout"
                className="p-1.5 text-white/70 hover:text-rose-400 hover:bg-rose-500/20 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Sign In Button */}
              <button
                onClick={onOpenAuth}
                className="bg-white border border-[#d4d4d4] rounded-[8px] px-4 py-2 text-[#171717] font-semibold text-[14px] hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>

              {/* Get Started Button -> Navigates to Inventory */}
              <button
                onClick={() => setActiveTab('inventory')}
                className="bg-[#7b39fc] rounded-[8px] px-4 py-2 text-[#fafafa] font-semibold text-[14px] shadow-md hover:bg-[#6826e3] transition-colors"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-white hover:opacity-80 focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 font-manrope animate-fade-in lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg width="29" height="28" viewBox="0 0 29 28" fill="none">
                <path
                  d="M1.04356 6.35771L13.6437 0.666504C14.0754 0.471504 14.5681 0.471504 14.9998 0.666504L27.5999 6.35771C28.2435 6.64831 28.6565 7.28471 28.6565 7.98971V19.3437C28.6565 20.0487 28.2435 20.6851 27.5999 20.9757L14.9998 26.6669C14.5681 26.8619 14.0754 26.8619 13.6437 26.6669L1.04356 20.9757C0.399961 20.6851 -0.0130386 20.0487 -0.0130386 19.3437V7.98971C-0.0130386 7.28471 0.399961 6.64831 1.04356 6.35771Z"
                  fill="white"
                />
              </svg>
              <span className="font-extrabold text-xl text-white">ApexMotors</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 text-center text-xl font-medium text-white">
            <button onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}>Home</button>
            <button onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}>Full Inventory Page</button>
            {user && (
              <button onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}>My Profile</button>
            )}
            {user?.role === 'ADMIN' && (
              <>
                <button onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }} className="text-[#a484d7]">
                  User Database
                </button>
                <button onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }} className="text-[#a484d7]">
                  Admin Dashboard
                </button>
              </>
            )}
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
          </div>

          <div className="flex flex-col space-y-3 w-full">
            {user ? (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-rose-600 text-white font-semibold rounded-lg"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-white text-[#171717] font-semibold rounded-lg border border-[#d4d4d4]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-[#7b39fc] text-white font-semibold rounded-lg"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
