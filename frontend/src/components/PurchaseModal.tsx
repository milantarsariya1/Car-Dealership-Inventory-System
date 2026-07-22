import React, { useState } from 'react';
import { Vehicle, User } from '../types';
import { X, ShoppingBag, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

interface PurchaseModalProps {
  vehicle: Vehicle;
  user: User | null;
  onClose: () => void;
  onConfirmPurchase: (vehicleId: string, quantity: number) => Promise<boolean>;
  onOpenAuth: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  vehicle,
  user,
  onClose,
  onConfirmPurchase,
  onOpenAuth,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = vehicle.price * quantity;

  const handlePurchase = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onConfirmPurchase(vehicle.id, quantity);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete purchase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Purchase Order Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Vehicle Spec Preview */}
          <div className="flex items-center space-x-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <img
              src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd'}
              alt={vehicle.model}
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {vehicle.category}
              </span>
              <h3 className="font-bold text-white text-base mt-1">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs text-slate-400 font-mono">VIN: {vehicle.vin}</p>
            </div>
          </div>

          {/* Unit Price & Stock */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Unit Price</span>
              <span className="text-base font-bold text-white">${vehicle.price.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Stock Available</span>
              <span className="text-base font-bold text-emerald-400">{vehicle.quantity} Units</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Quantity:
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max={vehicle.quantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(vehicle.quantity, Number(e.target.value))))
                }
                className="w-24 bg-slate-900 border border-slate-700 text-white font-bold text-center py-2 rounded-xl focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-400">
                (Max available: {vehicle.quantity})
              </span>
            </div>
          </div>

          {/* Price Calculation Summary */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal ({quantity} vehicle):</span>
              <span>${(vehicle.price * quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Dealership Processing Fee:</span>
              <span className="text-emerald-400 font-semibold">$0 (Waived)</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total Order Value:</span>
              <span className="text-xl font-extrabold text-cyan-400">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Errors or Login Warning */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center space-x-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!user && (
            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl text-xs text-blue-300 flex items-center justify-between">
              <span>You must be signed in to execute a vehicle purchase.</span>
              <button
                onClick={onOpenAuth}
                className="text-cyan-400 font-bold underline hover:text-cyan-300 ml-2"
              >
                Sign In Now
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handlePurchase}
              disabled={isSubmitting || vehicle.quantity < 1}
              className="w-2/3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Purchase...' : `Confirm Purchase ($${totalPrice.toLocaleString()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
