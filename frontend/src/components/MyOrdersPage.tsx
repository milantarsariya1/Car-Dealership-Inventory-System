import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShoppingBag,
  MapPin,
  Car,
  BadgeIndianRupee,
  Hash,
  CalendarDays,
  CircleDot,
  AlertCircle,
} from 'lucide-react';
import { User } from '../types';
import { ApiService } from '../services/api';

interface MyOrdersPageProps {
  user: User;
  onBack: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode; step: number }
> = {
  ORDER_CONFIRMED: {
    label: 'Order Confirmed',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    icon: <CircleDot className="w-4 h-4 text-amber-400" />,
    step: 1,
  },
  PROCESSING: {
    label: 'Processing & Preparing',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    icon: <Clock className="w-4 h-4 text-blue-400" />,
    step: 2,
  },
  DISPATCHED: {
    label: 'Dispatched',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    icon: <Truck className="w-4 h-4 text-purple-400" />,
    step: 3,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    step: 4,
  },
};

const STEPS = ['Order Confirmed', 'Processing', 'Dispatched', 'Out for Delivery'];

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ user, onBack }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ApiService.getMyOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        } else {
          setError(res.error || 'Failed to load orders.');
        }
      } catch {
        setError('Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <main className="flex-1 w-full min-h-screen bg-[#0b0914] font-manrope selection:bg-[#7b39fc] selection:text-white">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-[#7b39fc]/8 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a484d7] hover:text-white mb-4 font-cabin transition-colors bg-[#2b2344]/60 px-4 py-2 rounded-full border border-[#a484d7]/30 hover:bg-[#7b39fc]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-[#7b39fc]" />
                My Orders
              </h1>
              <p className="text-sm text-white/60 font-inter mt-1.5">
                Track all your purchased vehicles and real-time dispatch updates.
              </p>
            </div>

            {!loading && (
              <div className="text-xs font-bold px-4 py-2 rounded-full bg-[#2b2344] text-[#a484d7] border border-[#a484d7]/30 font-cabin">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address Banner */}
        {(user.address || user.city) && (
          <div className="glass-panel mb-8 p-4 rounded-[16px] border border-[#7b39fc]/20 bg-[#1c1634]/60 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#7b39fc] mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] uppercase font-bold text-[#a484d7] tracking-wider font-cabin mb-1">Delivery Address on File</p>
              <p className="text-sm text-white font-inter leading-relaxed">
                {user.address && <span className="font-semibold">{user.address}</span>}
                {user.city && `, ${user.city}`}
                {user.state && `, ${user.state}`}
                {user.pincode && ` - ${user.pincode}`}
                {user.country && ` (${user.country})`}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card h-52 rounded-[20px] animate-pulse bg-[#1c1634]/60 border border-[#a484d7]/10" />
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-[20px] text-center border border-rose-500/20 bg-rose-950/20">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <p className="text-white font-bold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel p-14 rounded-[20px] text-center border border-[#a484d7]/15 bg-[#1c1634]/50">
            <Car className="w-14 h-14 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-extrabold text-white mb-2">No purchases yet</h3>
            <p className="text-sm text-white/60 font-inter mb-6 max-w-sm mx-auto">
              You haven't purchased any vehicles yet. Head to the inventory to find your dream car!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-[#7b39fc] hover:bg-[#6826e3] text-white font-bold text-sm rounded-[10px] font-cabin transition-all"
            >
              Browse Inventory
            </button>
          </div>
        ) : (
          <div className="space-y-7">
            {orders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.dispatchStatus] || STATUS_CONFIG.ORDER_CONFIRMED;
              const orderDate = new Date(order.createdAt);

              return (
                <div
                  key={order.id}
                  className="glass-panel rounded-[20px] border border-[#a484d7]/20 bg-[#1c1634]/70 overflow-hidden shadow-xl"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Order Card Top Bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-[#130e26] border-b border-[#a484d7]/15">
                    <div className="flex items-center gap-4 text-xs font-cabin text-white/60">
                      <span className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" />
                        Order ID: <span className="text-white font-bold font-mono ml-1">{order.id.slice(0, 8).toUpperCase()}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} border text-xs font-bold font-cabin ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Main Card Body */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">

                      {/* Left: Car Image */}
                      <div className="md:w-52 h-36 md:h-auto rounded-[14px] overflow-hidden bg-black/40 shrink-0 relative group">
                        <img
                          src={order.vehicle?.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800'}
                          alt={`${order.vehicle?.make} ${order.vehicle?.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-[#7b39fc] text-white text-[10px] font-extrabold font-cabin rounded-[5px] uppercase tracking-wide">
                            {order.vehicle?.category}
                          </span>
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                          {order.vehicle?.make} {order.vehicle?.model}
                        </h2>
                        <p className="text-[11px] text-white/50 font-mono mt-0.5">VIN: {order.vehicle?.vin}</p>

                        {order.vehicle?.description && (
                          <p className="text-xs text-white/60 font-inter mt-2 leading-relaxed line-clamp-2">
                            {order.vehicle.description}
                          </p>
                        )}

                        {/* Price & Quantity grid */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="bg-[#2b2344]/60 rounded-[10px] p-3 border border-[#a484d7]/15">
                            <span className="text-[10px] text-white/50 block font-cabin uppercase tracking-wider mb-1">Unit Price</span>
                            <span className="text-sm font-bold text-white flex items-center gap-1">
                              <BadgeIndianRupee className="w-3.5 h-3.5 text-[#a484d7]" />
                              {formatINR(order.unitPrice)}
                            </span>
                          </div>
                          <div className="bg-[#2b2344]/60 rounded-[10px] p-3 border border-[#a484d7]/15">
                            <span className="text-[10px] text-white/50 block font-cabin uppercase tracking-wider mb-1">Quantity</span>
                            <span className="text-sm font-bold text-white flex items-center gap-1">
                              <Package className="w-3.5 h-3.5 text-[#a484d7]" />
                              {order.quantity}
                            </span>
                          </div>
                          <div className="bg-[#7b39fc]/15 rounded-[10px] p-3 border border-[#7b39fc]/30">
                            <span className="text-[10px] text-[#a484d7] block font-cabin uppercase tracking-wider mb-1">Total Paid</span>
                            <span className="text-sm font-extrabold text-white">
                              {formatINR(order.totalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Delivery ETA */}
                        <div className="mt-4 flex items-center gap-2 text-xs font-inter text-white/70">
                          <Truck className="w-4 h-4 text-[#a484d7] shrink-0" />
                          <span>Est. Delivery: <span className="font-bold text-white">{order.estimatedDelivery}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="mt-6 pt-5 border-t border-[#a484d7]/10">
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider font-cabin mb-4">Dispatch Progress</p>
                      <div className="flex items-center justify-between gap-1">
                        {STEPS.map((step, i) => {
                          const stepNum = i + 1;
                          const isCompleted = stepNum < statusConfig.step;
                          const isCurrent = stepNum === statusConfig.step;
                          return (
                            <React.Fragment key={step}>
                              <div className="flex flex-col items-center gap-1.5 flex-1">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                    isCompleted
                                      ? 'bg-[#7b39fc] border-[#7b39fc] text-white'
                                      : isCurrent
                                      ? 'bg-[#7b39fc]/20 border-[#7b39fc] text-[#a484d7] ring-2 ring-[#7b39fc]/30 ring-offset-1 ring-offset-[#1c1634]'
                                      : 'bg-[#2b2344] border-[#a484d7]/20 text-white/30'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <span className="text-[10px] font-extrabold">{stepNum}</span>
                                  )}
                                </div>
                                <span className={`text-[9px] font-cabin text-center leading-tight ${isCurrent ? 'text-[#a484d7] font-bold' : isCompleted ? 'text-white/70' : 'text-white/30'}`}>
                                  {step}
                                </span>
                              </div>
                              {i < STEPS.length - 1 && (
                                <div className={`h-0.5 flex-1 rounded transition-all ${stepNum < statusConfig.step ? 'bg-[#7b39fc]' : 'bg-[#2b2344]'}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
