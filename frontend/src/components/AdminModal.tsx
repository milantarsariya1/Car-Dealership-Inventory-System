import React, { useState, useEffect } from 'react';
import { Vehicle, Category } from '../types';
import { X, PlusCircle, Edit3, ShieldAlert, PackagePlus } from 'lucide-react';

interface AdminModalProps {
  mode: 'ADD' | 'EDIT' | 'RESTOCK';
  initialVehicle?: Vehicle | null;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<boolean>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  mode,
  initialVehicle,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    vin: '',
    make: '',
    model: '',
    category: 'SEDAN' as Category,
    price: 25000,
    quantity: 5,
    imageUrl: '',
    description: '',
  });

  const [restockAmount, setRestockAmount] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialVehicle) {
      setFormData({
        vin: initialVehicle.vin || '',
        make: initialVehicle.make || '',
        model: initialVehicle.model || '',
        category: initialVehicle.category || 'SEDAN',
        price: initialVehicle.price || 0,
        quantity: initialVehicle.quantity || 0,
        imageUrl: initialVehicle.imageUrl || '',
        description: initialVehicle.description || '',
      });
    }
  }, [initialVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let payload = mode === 'RESTOCK' ? { quantity: restockAmount } : formData;
      const success = await onSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-manrope">
      <div className="glass-panel w-full max-w-xl rounded-[20px] overflow-hidden border border-[#a484d7]/30 bg-[#1c1634] shadow-2xl">
        {/* Modal Title */}
        <div className="px-6 py-4 border-b border-[#a484d7]/20 flex items-center justify-between bg-[#130e26]">
          <div className="flex items-center space-x-2.5">
            {mode === 'ADD' && <PlusCircle className="w-5 h-5 text-emerald-400" />}
            {mode === 'EDIT' && <Edit3 className="w-5 h-5 text-[#a484d7]" />}
            {mode === 'RESTOCK' && <PackagePlus className="w-5 h-5 text-emerald-400" />}
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              {mode === 'ADD' && 'Add New Vehicle to Inventory'}
              {mode === 'EDIT' && `Edit Vehicle Specs (${initialVehicle?.make} ${initialVehicle?.model})`}
              {mode === 'RESTOCK' && `Restock Stock (${initialVehicle?.make} ${initialVehicle?.model})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-inter">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-[10px] flex items-center space-x-2 text-rose-400 text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'RESTOCK' ? (
            <div className="space-y-4">
              <div className="bg-[#130e26] p-4 rounded-[12px] border border-[#a484d7]/20 font-manrope">
                <span className="text-xs text-white/60 block font-cabin">Current Available Stock</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {initialVehicle?.quantity} Units
                </span>
              </div>
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1 font-cabin">
                  Additional Units to Restock:
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white font-bold p-3 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 font-cabin">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">VIN (Unique)*</label>
                  <input
                    type="text"
                    required
                    disabled={mode === 'EDIT'}
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    placeholder="e.g. 1HGCR2F83HA100099"
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Category*</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                  >
                    <option value="SEDAN" className="bg-[#2b2344] text-white">SEDAN</option>
                    <option value="SUV" className="bg-[#2b2344] text-white">SUV</option>
                    <option value="TRUCK" className="bg-[#2b2344] text-white">TRUCK</option>
                    <option value="COUPE" className="bg-[#2b2344] text-white">COUPE</option>
                    <option value="EV" className="bg-[#2b2344] text-white">EV</option>
                    <option value="HYBRID" className="bg-[#2b2344] text-white">HYBRID</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-cabin">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Make*</label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="e.g. Tesla, Porsche"
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Model*</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Model Y, 911"
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-cabin">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Price (₹)*</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Quantity in Stock*</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                  />
                </div>
              </div>

              <div className="font-cabin">
                <label className="text-xs font-semibold text-white/80 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none"
                />
              </div>

              <div className="font-cabin">
                <label className="text-xs font-semibold text-white/80 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, engine specs, warranty status..."
                  className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white text-xs p-2.5 rounded-[10px] focus:border-[#7b39fc] focus:outline-none resize-none"
                />
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex space-x-3 pt-3 border-t border-[#a484d7]/20 font-cabin">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-[10px] text-xs font-bold text-white/70 hover:text-white bg-[#2b2344] border border-[#a484d7]/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 rounded-[10px] text-xs font-bold text-white bg-[#7b39fc] hover:bg-[#6826e3] shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? 'Saving...' : mode === 'RESTOCK' ? 'Confirm Restock' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
