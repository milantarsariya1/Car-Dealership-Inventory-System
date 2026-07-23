import React from 'react';
import { Vehicle, User } from '../types';
import { ShoppingCart, Edit, Trash2, Plus, ShieldAlert } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  user: User | null;
  onSelectPurchase: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onRestock?: (vehicle: Vehicle) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  EV: 'bg-[#7b39fc]/20 text-[#a484d7] border-[#7b39fc]/40',
  HYBRID: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  SEDAN: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  SUV: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  COUPE: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  TRUCK: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
};

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  user,
  onSelectPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="glass-card rounded-[18px] overflow-hidden flex flex-col justify-between group bg-[#19142d]/80 border border-[#a484d7]/20 hover:border-[#7b39fc]/60 transition-all font-manrope">
      {/* Vehicle Image Container */}
      <div className="relative h-52 w-full bg-[#110d22] overflow-hidden">
        <img
          src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0914] via-transparent to-transparent opacity-90" />

        {/* Category Pill Badge */}
        <div className="absolute top-3 left-3 font-cabin">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-[6px] border ${
              CATEGORY_COLORS[vehicle.category] || 'bg-[#2b2344] text-white/80 border-[#a484d7]/30'
            }`}
          >
            {vehicle.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 font-cabin">
          {isOutOfStock ? (
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-[6px] bg-rose-500/20 text-rose-400 border border-rose-500/40 backdrop-blur-md flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              OUT OF STOCK
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-[6px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              {vehicle.quantity} IN STOCK
            </span>
          )}
        </div>

        {/* VIN Tag */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] font-mono text-white/50 bg-[#0b0914]/90 px-2 py-0.5 rounded-[4px] border border-[#a484d7]/20">
            VIN: {vehicle.vin}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-extrabold text-xl text-white group-hover:text-[#a484d7] transition-colors tracking-tight">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-xs text-white/60 mt-1.5 line-clamp-2 leading-relaxed font-inter">
            {vehicle.description || 'Premium dealership vehicle ready for immediate delivery.'}
          </p>
        </div>

        {/* Price & Purchase Action */}
        <div className="pt-3.5 border-t border-[#a484d7]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block font-cabin">
              Price
            </span>
            <span className="text-2xl font-bold text-white font-manrope">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>

          {/* User Purchase Button (DISABLED when quantity === 0) */}
          <button
            onClick={() => onSelectPurchase(vehicle)}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] font-cabin font-medium text-[14px] transition-all shadow-md ${
              isOutOfStock
                ? 'bg-[#2b2344] text-white/40 cursor-not-allowed border border-white/10 shadow-none'
                : 'bg-[#7b39fc] hover:bg-[#6826e3] text-white shadow-purple-500/20 hover:scale-[1.03] active:scale-[0.97] cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'OUT OF STOCK' : 'Purchase'}
          </button>
        </div>

        {/* Admin Quick Action Toolbar */}
        {user?.role === 'ADMIN' && (
          <div className="pt-2 border-t border-[#a484d7]/15 flex items-center justify-between text-xs font-cabin">
            <span className="text-white/50 font-medium">Admin Options:</span>
            <div className="flex items-center space-x-1.5">
              {onRestock && (
                <button
                  onClick={() => onRestock(vehicle)}
                  title="Restock Vehicle (+Stock)"
                  className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 rounded-[6px] border border-emerald-700/50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(vehicle)}
                  title="Edit Vehicle Specs"
                  className="p-1.5 bg-[#7b39fc]/20 hover:bg-[#7b39fc]/40 text-[#a484d7] rounded-[6px] border border-[#7b39fc]/50 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(vehicle.id)}
                  title="Delete Vehicle"
                  className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-[6px] border border-rose-700/50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
