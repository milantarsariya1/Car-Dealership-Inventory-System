import React, { useState } from 'react';
import { Vehicle, User } from '../types';
import { X, ShoppingBag, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-manrope">
      <div className="glass-panel w-full max-w-lg rounded-[20px] overflow-hidden border border-[#a484d7]/30 bg-[#1c1634] shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#a484d7]/20 flex items-center justify-between bg-[#130e26]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-[8px] bg-[#7b39fc]/20 text-[#a484d7]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Purchase Order Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Vehicle Spec Preview */}
          <div className="flex items-center space-x-4 bg-[#2b2344]/70 p-3.5 rounded-[14px] border border-[#a484d7]/20">
            <img
              src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd'}
              alt={vehicle.model}
              className="w-20 h-16 object-cover rounded-[10px]"
            />
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-[#7b39fc]/20 text-[#a484d7] border border-[#7b39fc]/30 font-cabin">
                {vehicle.category}
              </span>
              <h3 className="font-extrabold text-white text-base mt-1">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs text-white/50 font-mono">VIN: {vehicle.vin}</p>
            </div>
          </div>

          {/* Unit Price & Stock */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#2b2344]/50 p-3.5 rounded-[12px] border border-[#a484d7]/20">
              <span className="text-xs text-white/50 block font-cabin">Unit Price</span>
              <span className="text-lg font-bold text-white">₹{vehicle.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-[#2b2344]/50 p-3.5 rounded-[12px] border border-[#a484d7]/20">
              <span className="text-xs text-white/50 block font-cabin">Stock Available</span>
              <span className="text-lg font-bold text-emerald-400">{vehicle.quantity} Units</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-2 font-cabin">
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
                className="w-24 bg-[#2b2344] border border-[#a484d7]/30 text-white font-bold text-center py-2.5 rounded-[10px] focus:outline-none focus:border-[#7b39fc]"
              />
              <span className="text-xs text-white/50 font-inter">
                (Max available: {vehicle.quantity})
              </span>
            </div>
          </div>

          {/* Price Calculation Summary */}
          <div className="bg-[#130e26] p-4 rounded-[14px] border border-[#a484d7]/20 space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Subtotal ({quantity} vehicle):</span>
              <span>₹{(vehicle.price * quantity).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>Dealership Processing Fee:</span>
              <span className="text-emerald-400 font-semibold">₹0 (Waived)</span>
            </div>
            <div className="pt-2 border-t border-[#a484d7]/20 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total Order Value:</span>
              <span className="text-2xl font-extrabold text-[#a484d7]">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Errors or Login Warning */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-[10px] flex items-center space-x-2 text-rose-400 text-xs font-inter">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!user && (
            <div className="bg-[#7b39fc]/10 border border-[#7b39fc]/30 p-3 rounded-[10px] text-xs text-[#a484d7] flex items-center justify-between font-inter">
              <span>You must be signed in to execute a vehicle purchase.</span>
              <button
                onClick={onOpenAuth}
                className="text-white font-bold underline hover:text-[#a484d7] ml-2"
              >
                Sign In Now
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2 font-cabin">
            <button
              onClick={onClose}
              className="w-1/3 py-3 rounded-[10px] text-xs font-bold text-white/70 hover:text-white bg-[#2b2344] border border-[#a484d7]/30 hover:bg-[#392e5a] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handlePurchase}
              disabled={isSubmitting || vehicle.quantity < 1}
              className="w-2/3 py-3 rounded-[10px] text-xs font-semibold text-white bg-[#7b39fc] hover:bg-[#6826e3] shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Purchase...' : `Confirm Purchase (₹${totalPrice.toLocaleString('en-IN')})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
