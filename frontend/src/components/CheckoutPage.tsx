import React, { useState } from 'react';
import { Vehicle, User } from '../types';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  BadgeCheck,
  Lock,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';

interface CheckoutPageProps {
  vehicle: Vehicle;
  user: User | null;
  onBack: () => void;
  onConfirmPurchase: (vehicleId: string, quantity: number) => Promise<boolean>;
  onOpenAuth: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  vehicle,
  user,
  onBack,
  onConfirmPurchase,
  onOpenAuth,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'emi' | 'wire'>('card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [orderRef, setOrderRef] = useState<string>('');

  // Form states for Payment
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('889');
  const [cardName, setCardName] = useState(user?.name || 'Valued Customer');
  const [upiId, setUpiId] = useState('customer@okaxis');

  const unitPrice = vehicle.price;
  const totalPrice = unitPrice * quantity;

  const handleCompleteOrder = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onConfirmPurchase(vehicle.id, quantity);
      if (success) {
        setIsSuccess(true);
        setOrderRef(`APEX-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex-1 w-full px-6 lg:px-[120px] py-16 min-h-screen font-manrope">
        <div className="max-w-2xl mx-auto glass-panel p-8 md:p-12 rounded-[24px] border border-emerald-500/30 bg-[#161f2c]/80 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider mb-3 font-cabin">
              <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Congratulations on your new vehicle!
            </h2>
            <p className="text-sm text-white/70 mt-2 font-inter">
              Your purchase order for <span className="text-white font-bold">{quantity}x {vehicle.make} {vehicle.model}</span> has been confirmed.
            </p>
          </div>

          <div className="bg-[#130e26] p-5 rounded-[16px] border border-[#a484d7]/20 text-left space-y-3 font-mono text-xs text-white/80">
            <div className="flex justify-between border-b border-[#a484d7]/15 pb-2">
              <span className="text-white/50">Transaction Reference:</span>
              <span className="text-emerald-400 font-bold">{orderRef}</span>
            </div>
            <div className="flex justify-between border-b border-[#a484d7]/15 pb-2">
              <span className="text-white/50">VIN Number:</span>
              <span className="text-white font-bold">{vehicle.vin}</span>
            </div>
            <div className="flex justify-between border-b border-[#a484d7]/15 pb-2">
              <span className="text-white/50">Total Paid (INR):</span>
              <span className="text-emerald-400 font-bold text-base">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Purchaser Name:</span>
              <span className="text-white">{user?.name} ({user?.email})</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBack}
              className="bg-[#7b39fc] hover:bg-[#6826e3] text-white font-cabin font-bold px-8 py-3.5 rounded-[12px] transition-all shadow-lg hover:shadow-purple-500/30 w-full sm:w-auto"
            >
              Return to Vehicle Catalog
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full px-6 lg:px-[120px] py-10 min-h-screen font-manrope">
      {/* Top Breadcrumb & Page Title */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#a484d7] hover:text-white mb-3 font-cabin transition-colors bg-[#2b2344]/60 px-3.5 py-1.5 rounded-full border border-[#a484d7]/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#a484d7]/20 pb-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-[#7b39fc]" />
              Vehicle Purchase Checkout
            </h1>
            <p className="text-xs text-white/60 font-inter mt-1">
              Complete your dealership order, select payment options, and finalize certified vehicle ownership.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-cabin">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left = Car Showcase, Right = Payment Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (Specs & Big Car Showcase) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Big High-Res Car Image Container */}
          <div className="glass-panel p-4 rounded-[24px] border border-[#a484d7]/25 bg-[#17122b]/80 relative overflow-hidden group shadow-2xl">
            <div className="relative h-[320px] sm:h-[400px] w-full rounded-[18px] overflow-hidden bg-black/40">
              <img
                src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd'}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#7b39fc] text-white text-xs font-extrabold font-cabin shadow-lg uppercase tracking-wider">
                  {vehicle.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-cabin shadow-lg">
                  {vehicle.quantity > 0 ? `${vehicle.quantity} Units In Stock` : 'Out of Stock'}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 bg-[#0b0914]/80 backdrop-blur-md px-4 py-2 rounded-[12px] border border-white/10 text-right">
                <span className="text-[10px] text-white/60 block font-cabin uppercase tracking-wider">Unit Price</span>
                <span className="text-xl font-extrabold text-white">
                  ₹{vehicle.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Vehicle Title & Specification Cards */}
            <div className="p-4 pt-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-0.5">VIN: {vehicle.vin}</p>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-inter mt-4">
                <div className="bg-[#2b2344]/50 p-3 rounded-[12px] border border-[#a484d7]/20">
                  <span className="text-white/50 block font-cabin text-[11px]">Warranty</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 3-Year Certified
                  </span>
                </div>

                <div className="bg-[#2b2344]/50 p-3 rounded-[12px] border border-[#a484d7]/20">
                  <span className="text-white/50 block font-cabin text-[11px]">Stock Status</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#7b39fc]" /> Verified Available
                  </span>
                </div>

                <div className="bg-[#2b2344]/50 p-3 rounded-[12px] border border-[#a484d7]/20">
                  <span className="text-white/50 block font-cabin text-[11px]">Delivery</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-[#a484d7]" /> Showroom Direct
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Payment Gateway & Order Summary) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-[24px] border border-[#a484d7]/30 bg-[#1c1634]/90 space-y-6 shadow-2xl">
            
            {/* Payment Method Selector Header */}
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight mb-3">
                Select Payment Option
              </h3>

              <div className="grid grid-cols-2 gap-2 font-cabin text-xs">
                {/* Option 1: Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-2.5 p-3 rounded-[12px] border transition-all text-left font-semibold ${
                    paymentMethod === 'card'
                      ? 'bg-[#7b39fc] text-white border-[#7b39fc] shadow-lg shadow-purple-500/20'
                      : 'bg-[#2b2344]/60 text-white/70 border-[#a484d7]/20 hover:bg-[#2b2344]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Credit / Debit Card</span>
                </button>

                {/* Option 2: UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center gap-2.5 p-3 rounded-[12px] border transition-all text-left font-semibold ${
                    paymentMethod === 'upi'
                      ? 'bg-[#7b39fc] text-white border-[#7b39fc] shadow-lg shadow-purple-500/20'
                      : 'bg-[#2b2344]/60 text-white/70 border-[#a484d7]/20 hover:bg-[#2b2344]'
                  }`}
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>UPI / Net Banking</span>
                </button>

                {/* Option 3: EMI / Financing */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('emi')}
                  className={`flex items-center gap-2.5 p-3 rounded-[12px] border transition-all text-left font-semibold ${
                    paymentMethod === 'emi'
                      ? 'bg-[#7b39fc] text-white border-[#7b39fc] shadow-lg shadow-purple-500/20'
                      : 'bg-[#2b2344]/60 text-white/70 border-[#a484d7]/20 hover:bg-[#2b2344]'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Dealership EMI</span>
                </button>

                {/* Option 4: Bank Wire Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wire')}
                  className={`flex items-center gap-2.5 p-3 rounded-[12px] border transition-all text-left font-semibold ${
                    paymentMethod === 'wire'
                      ? 'bg-[#7b39fc] text-white border-[#7b39fc] shadow-lg shadow-purple-500/20'
                      : 'bg-[#2b2344]/60 text-white/70 border-[#a484d7]/20 hover:bg-[#2b2344]'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Bank Wire Transfer</span>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Method Input Form */}
            <div className="bg-[#130e26] p-4 rounded-[16px] border border-[#a484d7]/20 space-y-3 font-inter text-xs">
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-white/70 text-[11px] font-cabin block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white font-mono rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-white/70 text-[11px] font-cabin block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white font-mono rounded-[8px] p-2.5 text-center focus:outline-none focus:border-[#7b39fc]"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-[11px] font-cabin block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white font-mono rounded-[8px] p-2.5 text-center focus:outline-none focus:border-[#7b39fc]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-[11px] font-cabin block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-white/70 text-[11px] font-cabin block mb-1">UPI Virtual ID / PhonePe / GPay</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-[#2b2344] border border-[#a484d7]/30 text-white font-mono rounded-[8px] p-2.5 focus:outline-none focus:border-[#7b39fc]"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-400 font-inter">
                    Instant zero-fee payment confirmation via GPay, PhonePe, Paytm, or BHIM.
                  </p>
                </div>
              )}

              {paymentMethod === 'emi' && (
                <div className="space-y-2">
                  <span className="text-white font-bold block font-cabin">0% Down Payment EMI Option Available</span>
                  <p className="text-white/70 text-[11px]">
                    Monthly EMI starting at <span className="text-emerald-400 font-bold">₹{Math.round(totalPrice / 36).toLocaleString('en-IN')}/month</span> for 36 months via HDFC, ICICI, or SBI Dealership Credit.
                  </p>
                </div>
              )}

              {paymentMethod === 'wire' && (
                <div className="space-y-2 text-[11px]">
                  <span className="text-white font-bold block font-cabin">Official Dealership Escrow Bank Account</span>
                  <div className="font-mono text-white/80 bg-[#2b2344]/60 p-2.5 rounded-[8px] space-y-1">
                    <div>Bank: HDFC Bank Luxury Motors Escrow</div>
                    <div>A/C: 50200098231948</div>
                    <div>IFSC: HDFC0000128</div>
                  </div>
                </div>
              )}
            </div>

            {/* Select Order Quantity */}
            <div className="pt-2 border-t border-[#a484d7]/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white font-cabin">
                  Order Quantity:
                </label>
                <div className="flex items-center space-x-3 bg-[#130e26] p-1.5 rounded-[12px] border border-[#a484d7]/30">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 rounded-[6px] bg-[#2b2344] text-white disabled:opacity-40 hover:bg-[#7b39fc] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-white px-2 text-sm font-mono">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(vehicle.quantity, quantity + 1))}
                    disabled={quantity >= vehicle.quantity}
                    className="p-1 rounded-[6px] bg-[#2b2344] text-white disabled:opacity-40 hover:bg-[#7b39fc] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-white/50 block text-right mt-1 font-mono">
                Max Available: {vehicle.quantity} Units
              </span>
            </div>

            {/* Price Breakdown Box */}
            <div className="bg-[#130e26] p-4 rounded-[16px] border border-[#a484d7]/25 space-y-2.5 font-manrope">
              <div className="flex justify-between text-xs text-white/70">
                <span>Unit Price:</span>
                <span>₹{unitPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>Dealership Handling & Registration:</span>
                <span className="text-emerald-400 font-semibold">₹0 (Waived)</span>
              </div>
              <div className="pt-2 border-t border-[#a484d7]/20 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Amount (INR):</span>
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
              <div className="bg-[#7b39fc]/10 border border-[#7b39fc]/30 p-3.5 rounded-[12px] text-xs text-[#a484d7] flex items-center justify-between font-inter">
                <span>Sign in required to place vehicle order.</span>
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1 rounded-[8px] bg-[#7b39fc] text-white font-bold font-cabin text-xs hover:bg-[#6826e3]"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Complete Purchase Button */}
            <button
              onClick={handleCompleteOrder}
              disabled={isSubmitting || vehicle.quantity <= 0}
              className="w-full bg-[#7b39fc] hover:bg-[#6826e3] text-white font-cabin font-extrabold text-base rounded-[14px] py-4 transition-all shadow-xl hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Confirm & Complete Order (₹{totalPrice.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};
