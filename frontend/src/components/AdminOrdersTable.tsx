import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  CircleDot,
  User,
  MapPin,
  Car,
  BadgeIndianRupee,
  RefreshCw,
  Hash,
  Phone,
  Mail,
  CalendarDays,
  Package,
} from 'lucide-react';
import { ApiService } from '../services/api';

const STATUS_BADGES: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  ORDER_CONFIRMED: {
    label: 'Order Confirmed',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    icon: <CircleDot className="w-3.5 h-3.5 text-amber-400" />,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    icon: <Clock className="w-3.5 h-3.5 text-blue-400" />,
  },
  DISPATCHED: {
    label: 'Dispatched',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    icon: <Truck className="w-3.5 h-3.5 text-purple-400" />,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  },
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const AdminOrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiService.getAllOrdersForAdmin();
      if (res.success && res.data) {
        setOrders(res.data);
      } else {
        setError(res.error || 'Failed to fetch admin orders.');
      }
    } catch {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  return (
    <div className="glass-panel p-6 rounded-[20px] border border-[#a484d7]/20 bg-[#1c1634]/70 font-manrope mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7b39fc]/20 text-[#a484d7] border border-[#7b39fc]/30 text-xs font-bold uppercase tracking-wider mb-2 font-cabin">
            <ShoppingBag className="w-3.5 h-3.5" /> Customer Purchases & Dispatch Manager
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Pending & Confirmed Customer Orders ({orders.length})
          </h3>
          <p className="text-xs text-white/60 font-inter mt-1">
            Real-time record of all vehicles purchased by customers, purchaser delivery contacts, and dispatch status.
          </p>
        </div>

        <button
          onClick={fetchAdminOrders}
          disabled={loading}
          className="flex items-center gap-2 bg-[#2b2344] hover:bg-[#7b39fc] text-white text-xs font-semibold px-4 py-2 rounded-[8px] border border-[#a484d7]/30 transition-all font-cabin shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center text-white/50 text-xs animate-pulse font-mono">
          Loading customer purchase records...
        </div>
      ) : error ? (
        <div className="p-4 rounded-[12px] bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-white/40 font-inter text-xs">
          No customer orders found in the database.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#130e26] text-white/60 uppercase text-[10px] tracking-wider border-b border-[#a484d7]/20 font-cabin">
              <tr>
                <th className="p-3.5">Order ID & Date</th>
                <th className="p-3.5">Purchased Vehicle</th>
                <th className="p-3.5">Customer & Delivery Info</th>
                <th className="p-3.5">Qty & Total Paid</th>
                <th className="p-3.5">Dispatch Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a484d7]/15">
              {orders.map((order) => {
                const statusConfig = STATUS_BADGES[order.dispatchStatus] || STATUS_BADGES.ORDER_CONFIRMED;
                const orderDate = new Date(order.createdAt);

                return (
                  <tr key={order.id} className="hover:bg-[#2b2344]/40 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="p-3.5 align-top">
                      <div className="font-mono text-white font-bold text-xs flex items-center gap-1">
                        <Hash className="w-3 h-3 text-[#a484d7]" />
                        {order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="text-[11px] text-white/50 font-inter mt-1 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    {/* Purchased Vehicle */}
                    <td className="p-3.5 align-top">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.vehicle?.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400'}
                          alt={order.vehicle?.model}
                          className="w-14 h-10 object-cover rounded-md border border-[#a484d7]/20 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">
                            {order.vehicle?.make} {order.vehicle?.model}
                          </p>
                          <p className="text-[10px] font-mono text-white/50 mt-0.5">
                            VIN: {order.vehicle?.vin}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#7b39fc]/20 text-[#a484d7] text-[9px] font-bold font-cabin uppercase">
                            {order.vehicle?.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer & Delivery Address */}
                    <td className="p-3.5 align-top max-w-[240px]">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-xs flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#a484d7]" />
                          {order.user?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-white/60 font-inter flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-white/40 shrink-0" />
                          {order.user?.email}
                        </p>
                        {order.user?.phone && (
                          <p className="text-[11px] text-white/60 font-inter flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-white/40 shrink-0" />
                            {order.user.phone}
                          </p>
                        )}
                        {(order.user?.address || order.user?.city) && (
                          <p className="text-[10px] text-white/50 font-inter flex items-start gap-1 mt-1 bg-[#130e26] p-1.5 rounded border border-[#a484d7]/15">
                            <MapPin className="w-3 h-3 text-[#a484d7] shrink-0 mt-0.5" />
                            <span>
                              {order.user?.address}
                              {order.user?.city ? `, ${order.user.city}` : ''}
                              {order.user?.pincode ? ` (${order.user.pincode})` : ''}
                            </span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Qty & Total Paid */}
                    <td className="p-3.5 align-top font-cabin">
                      <div className="text-xs font-semibold text-white flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-[#a484d7]" />
                        Qty: {order.quantity}
                      </div>
                      <div className="text-sm font-extrabold text-emerald-400 mt-1 flex items-center gap-0.5">
                        <BadgeIndianRupee className="w-3.5 h-3.5" />
                        {formatINR(order.totalPrice)}
                      </div>
                      <span className="text-[10px] text-white/40 font-mono block">
                        ₹{order.unitPrice?.toLocaleString('en-IN')} / unit
                      </span>
                    </td>

                    {/* Dispatch Status */}
                    <td className="p-3.5 align-top font-cabin">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} border text-xs font-bold ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span>{statusConfig.label}</span>
                      </div>
                      <div className="text-[10px] text-white/50 mt-1 flex items-center gap-1 font-inter">
                        <Truck className="w-3 h-3 text-white/40" />
                        ETA: <span className="text-white font-medium">{order.estimatedDelivery}</span>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
