import React, { useState, useEffect } from 'react';
import { Vehicle, User } from './types';
import { ApiService } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { VehicleCard } from './components/VehicleCard';
import { PurchaseModal } from './components/PurchaseModal';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { Car, AlertCircle, CheckCircle2, ShieldCheck, PlusCircle } from 'lucide-react';

export function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [activeTab, setActiveTab] = useState<'catalog' | 'admin'>('catalog');

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

  const showNotification = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

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

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setMaxPrice(150000);
    setSortBy('newest');
  };

  const scrollToInventory = () => {
    const el = document.getElementById('inventory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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

      {/* Top Section with Video Hero & Navbar Overlay */}
      <div className="relative w-full">
        <Navbar
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenAddModal={() => setAdminModalState({ isOpen: true, mode: 'ADD', vehicle: null })}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <Hero
          onPrimaryClick={scrollToInventory}
          onSecondaryClick={() => {
            if (user) {
              scrollToInventory();
            } else {
              setShowAuthModal(true);
            }
          }}
        />
      </div>

      {/* Main Body / Full Scaled Width Inventory Section */}
      <main id="inventory" className="flex-1 w-full px-6 lg:px-[120px] py-12">
        
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

        {/* Content View: Catalog vs Admin Panel */}
        {activeTab === 'catalog' ? (
          <div>
            <div className="flex items-center justify-between mb-6 font-manrope">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                Available Vehicle Inventory
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#2b2344] text-[#a484d7] border border-[#a484d7]/30">
                  {filteredVehicles.length} Models
                </span>
              </h3>
            </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    user={user}
                    onSelectPurchase={(v) => setSelectedPurchaseVehicle(v)}
                    onEdit={(v) => setAdminModalState({ isOpen: true, mode: 'EDIT', vehicle: v })}
                    onDelete={(id) => handleDeleteVehicle(id)}
                    onRestock={(v) => setAdminModalState({ isOpen: true, mode: 'RESTOCK', vehicle: v })}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Admin Panel Inventory Table View */
          <div className="glass-panel p-6 rounded-[20px] border border-[#a484d7]/20 bg-[#1c1634]/70 font-manrope">
            <div className="flex items-center justify-between mb-6">
              <div>
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
                      <td className="p-3.5 font-semibold text-white">${v.price.toLocaleString()}</td>
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
        )}
      </main>

      {/* Footer - Full Scaled Width */}
      <footer id="contact" className="w-full px-6 lg:px-[120px] py-10 bg-[#07050e] border-t border-[#a484d7]/15 text-xs text-white/50 font-manrope mt-16">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ApexMotors Car Dealership Inventory System. Full-Stack TDD Project.</p>
          <p className="text-white/60">
            Powered by <span className="text-[#7b39fc] font-semibold">Node.js, Express, Prisma, Neon PostgreSQL & React</span>
          </p>
        </div>
      </footer>

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
    </div>
  );
}

export default App;
