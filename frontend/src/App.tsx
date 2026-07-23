import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Vehicle, User } from './types';
import { ApiService } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { VehicleCard } from './components/VehicleCard';
import { Footer } from './components/Footer';
import { PurchaseModal } from './components/PurchaseModal';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { CheckoutPage } from './components/CheckoutPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { Car, AlertCircle, CheckCircle2, ShieldCheck, PlusCircle, ArrowRight, ArrowLeft, Sparkles, Users, User as UserIcon, Edit3, Save, X } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPassword, setEditPassword] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');
  const [editState, setEditState] = useState<string>('');
  const [editPincode, setEditPincode] = useState<string>('');
  const [editCountry, setEditCountry] = useState<string>('');
  const [profileSaving, setProfileSaving] = useState<boolean>(false);

  // Admin User Edit State
  const [adminEditUser, setAdminEditUser] = useState<User | null>(null);
  const [adminUserForm, setAdminUserForm] = useState<{
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }>({
    name: '',
    email: '',
    role: 'USER',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [adminUserSaving, setAdminUserSaving] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(15000000);
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Navigation View State: 'catalog' (Home), 'inventory' (Dedicated Full Page), 'admin' (Admin Dashboard), 'users' (User Database), 'profile' (Personal Profile), 'checkout' (Checkout Page), 'orders' (My Orders)
  const [activeTab, setActiveTab] = useState<'catalog' | 'inventory' | 'admin' | 'users' | 'profile' | 'checkout' | 'orders'>('catalog');
  const [checkoutVehicle, setCheckoutVehicle] = useState<Vehicle | null>(null);

  const startCheckout = (vehicle: Vehicle) => {
    setCheckoutVehicle(vehicle);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination State for Dedicated Inventory Page
  const [displayLimit, setDisplayLimit] = useState<number>(ITEMS_PER_PAGE);

  // Modals State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedPurchaseVehicle, setSelectedPurchaseVehicle] = useState<Vehicle | null>(null);
  const [adminModalState, setAdminModalState] = useState<{
    isOpen: boolean;
    mode: 'ADD' | 'EDIT' | 'RESTOCK';
    vehicle?: Vehicle | null;
  }>({ isOpen: false, mode: 'ADD', vehicle: null });

  // Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Scroll tracking for Parallax Depth effects
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const inventoryParallaxOffset = scrollY * 0.25;
  const inventoryParallaxScale = 1 + Math.min(scrollY * 0.0002, 0.12);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Reset pagination when search query or category filter changes
  useEffect(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  // Initialize Lenis Smooth Inertia Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Load Saved Auth Token & Initial Inventory Data
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && user) {
      fetchUsers();
    }
  }, [activeTab, user]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await ApiService.getAllUsers();
      if (res.success && res.data) {
        setDbUsers(res.data);
      }
    } catch (err) {
      showNotification('error', 'Failed to fetch user database.');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleStartEditProfile = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
      setEditCity(user.city || '');
      setEditState(user.state || '');
      setEditPincode(user.pincode || '');
      setEditCountry(user.country || 'India');
      setEditPassword('');
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      showNotification('error', 'Name and email are required.');
      return;
    }
    setProfileSaving(true);
    try {
      const res = await ApiService.updateProfile({
        name: editName,
        email: editEmail,
        password: editPassword.trim() ? editPassword : undefined,
        phone: editPhone,
        address: editAddress,
        city: editCity,
        state: editState,
        pincode: editPincode,
        country: editCountry,
      });
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setIsEditingProfile(false);
        setEditPassword('');
        showNotification('success', 'Profile & delivery details updated successfully!');
      } else {
        showNotification('error', res.error || 'Failed to update profile.');
      }
    } catch (err) {
      showNotification('error', 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAdminStartEditUser = (u: User) => {
    setAdminEditUser(u);
    setAdminUserForm({
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone || '',
      address: u.address || '',
      city: u.city || '',
      state: u.state || '',
      pincode: u.pincode || '',
      country: u.country || 'India',
    });
  };

  const handleAdminSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEditUser) return;
    setAdminUserSaving(true);
    try {
      const res = await ApiService.updateUserByAdmin(adminEditUser.id, adminUserForm);
      if (res.success && res.data) {
        showNotification('success', `Updated details for ${res.data.name}!`);
        setAdminEditUser(null);
        fetchUsers();
      } else {
        showNotification('error', res.error || 'Failed to update user.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user.');
    } finally {
      setAdminUserSaving(false);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getAllVehicles();
      if (res.success && res.data) {
        setVehicles(res.data);
      }
    } catch (err) {
      showNotification('error', 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('catalog');
    showNotification('success', 'Successfully logged out.');
  };

  // Confirm Purchase Handler
  const handleConfirmPurchase = async (vehicleId: string, quantity: number): Promise<boolean> => {
    try {
      const res = await ApiService.purchaseVehicle(vehicleId, quantity);
      if (!res.success) {
        throw new Error(res.error || 'Purchase transaction failed.');
      }

      showNotification('success', `Purchase successful! Order confirmed.`);
      await fetchVehicles();
      return true;
    } catch (err: any) {
      showNotification('error', err.message || 'Purchase failed.');
      return false;
    }
  };

  // Admin Form Submit Handler (Add, Edit, Restock)
  const handleAdminSubmit = async (payload: any): Promise<boolean> => {
    try {
      let res;
      if (adminModalState.mode === 'ADD') {
        res = await ApiService.createVehicle(payload);
      } else if (adminModalState.mode === 'EDIT' && adminModalState.vehicle) {
        res = await ApiService.updateVehicle(adminModalState.vehicle.id, payload);
      } else if (adminModalState.mode === 'RESTOCK' && adminModalState.vehicle) {
        res = await ApiService.restockVehicle(adminModalState.vehicle.id, payload.quantity);
      }

      if (res && !res.success) {
        throw new Error(res.error || 'Action failed.');
      }

      showNotification('success', `Inventory updated successfully!`);
      await fetchVehicles();
      return true;
    } catch (err: any) {
      showNotification('error', err.message || 'Action failed.');
      return false;
    }
  };

  // Delete Vehicle Handler
  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from inventory?')) {
      return;
    }

    try {
      const res = await ApiService.deleteVehicle(id);
      if (res.success) {
        showNotification('success', 'Vehicle removed from inventory.');
        await fetchVehicles();
      } else {
        throw new Error(res.error || 'Delete failed.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Delete operation failed.');
    }
  };

  // Filtering & Sorting Logic
  const filteredVehicles = vehicles
    .filter((v) => {
      const matchesSearch =
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
      const matchesPrice = v.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock-desc') return b.quantity - a.quantity;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  // Home Page Limit: Only 3 Featured Motors
  const featuredHomeVehicles = filteredVehicles.slice(0, 3);

  // Inventory Page Limit: Paginated items (batches of 6)
  const visibleInventoryVehicles = filteredVehicles.slice(0, displayLimit);
  const hasMoreInventoryVehicles = displayLimit < filteredVehicles.length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setMaxPrice(150000);
    setSortBy('newest');
  };

  const navigateToFullInventoryPage = () => {
    setActiveTab('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#7b39fc] selection:text-white bg-[#0b0914]">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-semibold border backdrop-blur-md animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/40 shadow-rose-500/10'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <Navbar
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenAddModal={() => setAdminModalState({ isOpen: true, mode: 'ADD', vehicle: null })}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* VIEW 1: HOME PAGE (Hero + 3 Featured Inventory Motors) */}
      {activeTab === 'catalog' && (
        <div className="relative bg-[#0b0914]">
          {/* Video Hero Section */}
          <Hero
            onPrimaryClick={navigateToFullInventoryPage}
            onSecondaryClick={() => {
              if (user) {
                navigateToFullInventoryPage();
              } else {
                setShowAuthModal(true);
              }
            }}
          />

          {/* Featured Home Inventory Section — flows directly from hero with no gap */}
          <section
            id="inventory"
            className="relative w-full px-6 lg:px-[120px] pb-20 pt-4 bg-[#0b0914]"
          >
            {/* Radial ambient glow behind section header for atmospheric depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] rounded-full bg-[#7b39fc]/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-10 font-manrope gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7b39fc]/20 text-[#a484d7] border border-[#7b39fc]/30 text-xs font-bold uppercase tracking-wider mb-3 font-cabin">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Dealership Collection
                </span>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                  Handpicked Luxury Motors
                </h2>
                <p className="text-sm text-white/60 font-inter mt-1.5">Real-time certified inventory — purchase directly from the dealership floor.</p>
              </div>

              <button
                onClick={navigateToFullInventoryPage}
                className="flex items-center gap-2 text-[#a484d7] hover:text-white font-cabin font-bold text-sm bg-[#2b2344]/80 hover:bg-[#7b39fc] px-5 py-2.5 rounded-[10px] border border-[#a484d7]/30 transition-all shadow-md shrink-0"
              >
                <span>View Full Inventory ({filteredVehicles.length} Motors)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="glass-card h-80 rounded-2xl animate-pulse bg-[#19142d]/60" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredHomeVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      user={user}
                      onSelectPurchase={(v) => startCheckout(v)}
                      onEdit={(v) => setAdminModalState({ isOpen: true, mode: 'EDIT', vehicle: v })}
                      onDelete={(id) => handleDeleteVehicle(id)}
                      onRestock={(v) => setAdminModalState({ isOpen: true, mode: 'RESTOCK', vehicle: v })}
                    />
                  ))}
                </div>
              )}

              {/* Load More Button → Navigates to Dedicated Full Inventory Page */}
              <div className="flex flex-col items-center justify-center mt-14 space-y-3 font-manrope">
                <button
                  onClick={navigateToFullInventoryPage}
                  className="bg-[#7b39fc] hover:bg-[#6826e3] text-white font-cabin font-semibold text-[16px] rounded-[10px] px-9 py-4 transition-all shadow-xl hover:shadow-purple-500/30 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5"
                >
                  <span>Browse All Vehicles ({filteredVehicles.length - 3} more models)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-white/50 font-inter">
                  Showing 3 featured models · Click above to explore the full dealership fleet
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: DEDICATED FULL INVENTORY PAGE */}
      {activeTab === 'inventory' && (
        <main className="flex-1 w-full min-h-screen bg-[#0b0914] selection:bg-[#7b39fc] selection:text-white">
          
          {/* Top Video Hero Banner Section (Like Home Page) */}
          <section className="relative w-full h-[420px] md:h-[480px] flex flex-col items-center justify-center overflow-hidden bg-[#0f172a] font-manrope">
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source
                src="https://assets.mixkit.co/videos/74/74-720.mp4"
                type="video/mp4"
              />
            </video>
            {/* Light Vignette & Smooth Bottom Edge Overlay — video more visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0b0914]/60 z-1" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0b0914] via-[#0b0914]/60 to-transparent pointer-events-none z-1" />

            {/* Banner Header Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-[900px] px-6 mt-6">
              
              {/* Back to Home Button & Live Counter */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a484d7] hover:text-white bg-[#2b2344]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#a484d7]/30 font-cabin transition-all hover:bg-[#7b39fc]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <span className="text-xs font-bold px-4 py-2 rounded-full bg-[#7b39fc]/20 backdrop-blur-md text-emerald-400 border border-emerald-500/30 font-cabin uppercase tracking-wider">
                  {filteredVehicles.length} Total Vehicles Available
                </span>
              </div>

              {/* Best Styled Website Name + Inventory Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-2xl">
                <span className="gradient-text font-instrument italic font-normal pr-2">ApexMotors</span> Inventory
              </h1>

              {/* Catchy Subtitle Subtext */}
              <p className="font-inter text-sm md:text-base text-white/80 max-w-[680px] leading-relaxed">
                Explore handpicked luxury sedans, electric vehicles, sports coupes, and rugged 4x4 trucks. Filter by category, price, or place atomic purchase orders in real time.
              </p>
            </div>
          </section>

          {/* Main Inventory Controls & Grid Section (Below Video Banner) */}
          <section className="w-full px-6 lg:px-[120px] py-12 space-y-8">
            {/* Inventory Statistics Bar */}
            <StatsBar vehicles={vehicles} />

            {/* Filter and Search Controls */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onReset={resetFilters}
            />

            {/* Vehicles Catalog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="glass-card h-80 rounded-2xl animate-pulse bg-[#19142d]/60" />
                ))}
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl border border-[#a484d7]/20 bg-[#1c1634]/60">
                <Car className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white font-manrope">No vehicles match your search criteria</h4>
                <p className="text-xs text-white/60 mt-1 font-inter">Try resetting filters or adjusting your price slider.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2.5 bg-[#7b39fc] hover:bg-[#6826e3] text-white text-xs font-bold font-cabin rounded-[10px] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleInventoryVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      user={user}
                      onSelectPurchase={(v) => startCheckout(v)}
                      onEdit={(v) => setAdminModalState({ isOpen: true, mode: 'EDIT', vehicle: v })}
                      onDelete={(id) => handleDeleteVehicle(id)}
                      onRestock={(v) => setAdminModalState({ isOpen: true, mode: 'RESTOCK', vehicle: v })}
                    />
                  ))}
                </div>

                {/* Pagination Controls inside Dedicated Inventory Page */}
                {hasMoreInventoryVehicles && (
                  <div className="flex flex-col items-center justify-center mt-12 space-y-3 font-manrope">
                    <button
                      onClick={() => setDisplayLimit((prev) => prev + ITEMS_PER_PAGE)}
                      className="bg-[#7b39fc] hover:bg-[#6826e3] text-white font-cabin font-semibold text-[15px] rounded-[10px] px-8 py-3.5 transition-all shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Load More Vehicles ({filteredVehicles.length - displayLimit} remaining)
                    </button>
                    <p className="text-xs text-white/50 font-inter">
                      Displaying {visibleInventoryVehicles.length} of {filteredVehicles.length} available models
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      )}

      {/* VIEW 3: ADMIN MANAGEMENT DASHBOARD */}
      {activeTab === 'admin' && (
        <main className="flex-1 w-full px-6 lg:px-[120px] py-10 min-h-screen">
          <div className="glass-panel p-6 rounded-[20px] border border-[#a484d7]/20 bg-[#1c1634]/70 font-manrope">
            <div className="flex items-center justify-between mb-6">
              <div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a484d7] hover:text-white mb-2 font-cabin transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                  <ShieldCheck className="w-5 h-5 text-[#a484d7]" />
                  Admin Inventory Management Dashboard
                </h3>
                <p className="text-xs text-white/60 font-inter">Add, update, restock, or remove dealership inventory items.</p>
              </div>

              <button
                onClick={() => setAdminModalState({ isOpen: true, mode: 'ADD', vehicle: null })}
                className="flex items-center gap-2 bg-[#7b39fc] hover:bg-[#6826e3] text-white text-xs font-semibold px-4 py-2.5 rounded-[10px] shadow-md transition-all font-cabin"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Vehicle
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#130e26] text-white/60 uppercase text-[10px] tracking-wider border-b border-[#a484d7]/20 font-cabin">
                  <tr>
                    <th className="p-3.5">Vehicle</th>
                    <th className="p-3.5">VIN</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock Quantity</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a484d7]/15">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-[#2b2344]/40 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-3">
                        <img
                          src={v.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd'}
                          alt={v.model}
                          className="w-10 h-8 object-cover rounded-md"
                        />
                        {v.make} {v.model}
                      </td>
                      <td className="p-3.5 font-mono text-white/60">{v.vin}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-[6px] bg-[#2b2344] font-semibold text-[#a484d7] border border-[#a484d7]/30">
                          {v.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-white">₹{v.price.toLocaleString('en-IN')}</td>
                      <td className="p-3.5">
                        {v.quantity === 0 ? (
                          <span className="px-2.5 py-1 rounded-[6px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40">
                            0 (OUT OF STOCK)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-[6px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                            {v.quantity} Units
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2 font-cabin">
                        <button
                          onClick={() => setAdminModalState({ isOpen: true, mode: 'RESTOCK', vehicle: v })}
                          className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 rounded-[6px] font-semibold"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => setAdminModalState({ isOpen: true, mode: 'EDIT', vehicle: v })}
                          className="px-2.5 py-1 bg-[#7b39fc]/20 text-[#a484d7] hover:bg-[#7b39fc]/40 border border-[#7b39fc]/40 rounded-[6px] font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(v.id)}
                          className="px-2.5 py-1 bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800 rounded-[6px] font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* VIEW 4: USER DATABASE */}
      {activeTab === 'users' && (
        <main className="flex-1 w-full px-6 lg:px-[120px] py-10 min-h-screen">
          <div className="glass-panel p-6 rounded-[20px] border border-[#a484d7]/20 bg-[#1c1634]/70 font-manrope">
            <div className="flex items-center justify-between mb-6">
              <div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a484d7] hover:text-white mb-2 font-cabin transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                  <Users className="w-5 h-5 text-[#a484d7]" />
                  User Database
                </h3>
                <p className="text-xs text-white/60 font-inter">View all registered dealership users and their roles.</p>
              </div>
            </div>

            {usersLoading ? (
              <div className="text-white/60 text-sm py-4 animate-pulse">Loading user database...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#130e26] text-white/60 uppercase text-[10px] tracking-wider border-b border-[#a484d7]/20 font-cabin">
                    <tr>
                      <th className="p-3.5">User Details</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Delivery Address</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#a484d7]/15">
                    {dbUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#2b2344]/40 transition-colors">
                        <td className="p-3.5 font-bold text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#7b39fc] flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          {u.name}
                        </td>
                        <td className="p-3.5 font-mono text-white/60">{u.email}</td>
                        <td className="p-3.5 font-mono text-white/80">{u.phone || 'N/A'}</td>
                        <td className="p-3.5 text-white/70 max-w-[200px] truncate">
                          {u.address ? `${u.address}, ${u.city || ''} ${u.pincode || ''}` : 'Not configured'}
                        </td>
                        <td className="p-3.5">
                          {u.role === 'ADMIN' ? (
                            <span className="px-2.5 py-1 rounded-[6px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 text-[10px] flex items-center w-max gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              ADMIN
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-[6px] bg-[#2b2344] text-[#a484d7] font-bold border border-[#a484d7]/30 text-[10px] w-max block">
                              USER
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleAdminStartEditUser(u)}
                            className="px-3 py-1.5 bg-[#7b39fc]/20 hover:bg-[#7b39fc] text-[#a484d7] hover:text-white rounded-[6px] border border-[#7b39fc]/40 font-bold transition-all flex items-center gap-1.5 ml-auto text-[11px]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}

      {/* VIEW 5: PERSONAL PROFILE */}
      {activeTab === 'profile' && user && (
        <main className="flex-1 w-full px-6 lg:px-[120px] py-10 min-h-screen">
          <div className="max-w-2xl mx-auto glass-panel p-8 rounded-[20px] border border-[#a484d7]/20 bg-[#1c1634]/70 font-manrope">
            <div className="flex items-start justify-between mb-8">
              <div>
                <button
                  onClick={() => { setActiveTab('catalog'); setIsEditingProfile(false); }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a484d7] hover:text-white mb-3 font-cabin transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <h3 className="text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                  <UserIcon className="w-6 h-6 text-[#a484d7]" />
                  My Profile
                </h3>
                <p className="text-sm text-white/60 font-inter mt-1">Manage your personal details and account preferences.</p>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={handleStartEditProfile}
                  className="px-4 py-2 bg-[#7b39fc] hover:bg-[#6826e3] text-white font-bold text-xs uppercase tracking-wider rounded-[8px] flex items-center gap-2 transition-colors shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 font-bold text-xs uppercase tracking-wider rounded-[8px] flex items-center gap-1.5 transition-colors border border-white/20"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7b39fc] to-[#a484d7] flex items-center justify-center text-white font-bold text-3xl uppercase shadow-[0_0_20px_rgba(123,57,252,0.4)]">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{user.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {user.role === 'ADMIN' ? (
                      <span className="px-2.5 py-1 rounded-[6px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 text-[10px] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        ADMIN
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-[6px] bg-[#2b2344] text-[#a484d7] font-bold border border-[#a484d7]/30 text-[10px]">
                        USER
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isEditingProfile ? (
                /* READ-ONLY VIEW */
                <div className="bg-[#130e26]/50 rounded-xl p-5 border border-[#a484d7]/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Full Name</label>
                      <div className="text-white font-medium text-sm mt-1">{user.name}</div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Email Address</label>
                      <div className="text-white font-mono text-sm mt-1">{user.email}</div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Phone Number</label>
                      <div className="text-white font-mono text-sm mt-1">{user.phone || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Password</label>
                      <div className="text-white font-mono text-sm mt-1 tracking-[0.2em]">********</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#a484d7]/15">
                    <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-2">Delivery & Shipping Address</label>
                    <div className="bg-[#1c1634]/60 p-3.5 rounded-lg border border-[#a484d7]/20 text-xs text-white/80 space-y-1 font-inter">
                      <div className="font-bold text-white">{user.address || 'No street address configured'}</div>
                      {user.city && (
                        <div>{user.city}, {user.state} - {user.pincode} ({user.country || 'India'})</div>
                      )}
                    </div>
                  </div>

                  {user.createdAt && (
                    <div className="pt-2 border-t border-[#a484d7]/15">
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Joined Date</label>
                      <div className="text-white font-mono text-xs mt-1 text-white/80">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* EDIT FORM VIEW */
                <form onSubmit={handleSaveProfile} className="bg-[#130e26]/80 rounded-xl p-6 border border-[#a484d7]/30 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white font-medium text-sm focus:outline-none focus:border-[#7b39fc] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#7b39fc] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1.5">Contact Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white text-sm focus:outline-none focus:border-[#7b39fc] transition-colors"
                    />
                  </div>

                  {/* Delivery Address Fields */}
                  <div className="space-y-3 pt-2 border-t border-[#a484d7]/20">
                    <span className="text-[10px] uppercase font-extrabold text-white tracking-wider block">Default Delivery & Shipping Destination</span>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1">Street Address</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="101 Luxury Palms, Bandra West"
                        className="w-full px-4 py-2.5 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white text-sm focus:outline-none focus:border-[#7b39fc] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1">City</label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          placeholder="Mumbai"
                          className="w-full px-3 py-2 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white text-xs focus:outline-none focus:border-[#7b39fc]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1">State</label>
                        <input
                          type="text"
                          value={editState}
                          onChange={(e) => setEditState(e.target.value)}
                          placeholder="Maharashtra"
                          className="w-full px-3 py-2 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white text-xs focus:outline-none focus:border-[#7b39fc]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1">Pincode</label>
                        <input
                          type="text"
                          value={editPincode}
                          onChange={(e) => setEditPincode(e.target.value)}
                          placeholder="400050"
                          className="w-full px-3 py-2 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-[#7b39fc]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] uppercase font-bold text-[#a484d7] tracking-wider block mb-1.5">
                      New Password <span className="text-white/40 font-normal lowercase">(leave blank to keep current)</span>
                    </label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 bg-[#1c1634] border border-[#a484d7]/40 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#7b39fc] transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-3 border-t border-[#a484d7]/20">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-5 py-2 bg-[#7b39fc] hover:bg-[#6826e3] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {profileSaving ? 'Saving...' : 'Save Profile & Delivery Data'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      )}

      {/* VIEW 6: DEDICATED FULL CHECKOUT PAGE */}
      {activeTab === 'checkout' && checkoutVehicle && (
        <CheckoutPage
          vehicle={checkoutVehicle}
          user={user}
          onBack={() => setActiveTab('inventory')}
          onConfirmPurchase={handleConfirmPurchase}
          onOpenAuth={() => setShowAuthModal(true)}
          onViewOrders={() => setActiveTab('orders')}
        />
      )}

      {/* VIEW 7: MY ORDERS PAGE */}
      {activeTab === 'orders' && user && (
        <MyOrdersPage
          user={user}
          onBack={() => setActiveTab('catalog')}
        />
      )}

      {/* Professional & Useful Footer */}
      <Footer onNotify={showNotification} />

      {/* Active Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(u, token) => {
            setUser(u);
            localStorage.setItem('user', JSON.stringify(u));
            localStorage.setItem('token', token);
            showNotification('success', `Welcome back, ${u.name}!`);
          }}
        />
      )}

      {selectedPurchaseVehicle && (
        <PurchaseModal
          vehicle={selectedPurchaseVehicle}
          user={user}
          onClose={() => setSelectedPurchaseVehicle(null)}
          onConfirmPurchase={handleConfirmPurchase}
          onOpenAuth={() => {
            setSelectedPurchaseVehicle(null);
            setShowAuthModal(true);
          }}
        />
      )}

      {adminModalState.isOpen && (
        <AdminModal
          mode={adminModalState.mode}
          initialVehicle={adminModalState.vehicle}
          onClose={() => setAdminModalState({ ...adminModalState, isOpen: false })}
          onSubmit={handleAdminSubmit}
        />
      )}

      {/* Admin User Account & Delivery Editor Modal */}
      {adminEditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-manrope">
          <div className="glass-panel w-full max-w-xl rounded-[20px] overflow-hidden border border-[#a484d7]/30 bg-[#1c1634] shadow-2xl relative">
            <div className="px-6 py-4 border-b border-[#a484d7]/20 flex items-center justify-between bg-[#130e26]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-[8px] bg-[#7b39fc]/20 text-[#a484d7]">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold text-white tracking-tight">Edit User Account & Delivery Data</h2>
              </div>
              <button
                onClick={() => setAdminEditUser(null)}
                className="p-1.5 rounded-[8px] text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminSaveUser} className="p-6 space-y-4 text-xs font-inter">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 text-[11px] font-cabin block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={adminUserForm.name}
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, name: e.target.value })}
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/70 text-[11px] font-cabin block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={adminUserForm.email}
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, email: e.target.value })}
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white font-mono rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 text-[11px] font-cabin block mb-1">Account Role</label>
                  <select
                    value={adminUserForm.role}
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, role: e.target.value as 'USER' | 'ADMIN' })}
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/70 text-[11px] font-cabin block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={adminUserForm.phone}
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#a484d7]/20 space-y-3">
                <span className="text-white font-bold block font-cabin text-xs">Customer Delivery Address</span>
                <div>
                  <label className="text-white/70 text-[11px] font-cabin block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={adminUserForm.address}
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, address: e.target.value })}
                    placeholder="Street / Flat / House Address"
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-white/70 text-[11px] font-cabin block mb-1">City</label>
                    <input
                      type="text"
                      value={adminUserForm.city}
                      onChange={(e) => setAdminUserForm({ ...adminUserForm, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white rounded-[8px] p-2 focus:outline-none focus:border-[#7b39fc]"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-[11px] font-cabin block mb-1">State</label>
                    <input
                      type="text"
                      value={adminUserForm.state}
                      onChange={(e) => setAdminUserForm({ ...adminUserForm, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white rounded-[8px] p-2 focus:outline-none focus:border-[#7b39fc]"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-[11px] font-cabin block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={adminUserForm.pincode}
                      onChange={(e) => setAdminUserForm({ ...adminUserForm, pincode: e.target.value })}
                      placeholder="Pincode"
                      className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white font-mono rounded-[8px] p-2 focus:outline-none focus:border-[#7b39fc]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#a484d7]/20 font-cabin">
                <button
                  type="button"
                  onClick={() => setAdminEditUser(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminUserSaving}
                  className="px-5 py-2 bg-[#7b39fc] hover:bg-[#6826e3] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {adminUserSaving ? 'Saving...' : 'Save User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
