import React from 'react';
import { Vehicle, User } from '../types';
import { ShoppingCart, Edit, Trash2, Plus, Zap, ShieldAlert } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  user: User | null;
  onSelectPurchase: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onRestock?: (vehicle: Vehicle) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  EV: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  HYBRID: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  SEDAN: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  SUV: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  COUPE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  TRUCK: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
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
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      {/* Vehicle Image Container */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        <img
          src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Category Pill Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              CATEGORY_COLORS[vehicle.category] || 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {vehicle.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 backdrop-blur-md flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              OUT OF STOCK
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              {vehicle.quantity} IN STOCK
            </span>
          )}
        </div>

        {/* VIN Tag */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            VIN: {vehicle.vin}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {vehicle.description || 'Premium dealership vehicle ready for immediate delivery.'}
          </p>
        </div>

        {/* Price & Purchase Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Price Tag
            </span>
            <span className="text-xl font-extrabold text-white">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>

          {/* User Purchase Button (DISABLED when quantity === 0) */}
          <button
            onClick={() => onSelectPurchase(vehicle)}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 shadow-none'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20 hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? 'OUT OF STOCK' : 'Purchase'}
          </button>
        </div>

        {/* Admin Quick Action Toolbar */}
        {user?.role === 'ADMIN' && (
          <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Admin Actions:</span>
            <div className="flex items-center space-x-1.5">
              {onRestock && (
                <button
                  onClick={() => onRestock(vehicle)}
                  title="Restock Vehicle (+Stock)"
                  className="p-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 rounded-lg border border-emerald-800/50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(vehicle)}
                  title="Edit Vehicle Specs"
                  className="p-1.5 bg-blue-950/40 hover:bg-blue-900/60 text-blue-400 rounded-lg border border-blue-800/50 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(vehicle.id)}
                  title="Delete Vehicle"
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-lg border border-rose-800/50 transition-colors"
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
