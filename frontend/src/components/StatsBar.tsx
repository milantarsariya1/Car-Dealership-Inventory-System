import React from 'react';
import { Vehicle } from '../types';
import { Package, CheckCircle2, AlertTriangle, DollarSign } from 'lucide-react';

interface StatsBarProps {
  vehicles: Vehicle[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ vehicles }) => {
  const totalVehicles = vehicles.length;
  const inStockCount = vehicles.filter((v) => v.quantity > 0).length;
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass-card p-4 rounded-xl flex items-center space-x-3 border-l-4 border-l-blue-500">
        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Vehicles</p>
          <p className="text-xl font-bold text-white">{totalVehicles}</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl flex items-center space-x-3 border-l-4 border-l-emerald-500">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Available Models</p>
          <p className="text-xl font-bold text-emerald-400">{inStockCount}</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl flex items-center space-x-3 border-l-4 border-l-rose-500">
        <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Out of Stock</p>
          <p className="text-xl font-bold text-rose-400">{outOfStockCount}</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl flex items-center space-x-3 border-l-4 border-l-cyan-500">
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Inventory Value</p>
          <p className="text-xl font-bold text-cyan-300">
            ${totalInventoryValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
