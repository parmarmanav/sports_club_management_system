import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Smartphone, Banknote, ShieldCheck, ArrowRight, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { bookingsApi } from '../../api/bookings';

export default function CheckoutPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Accept standard items or a single item from location state
  const { type = 'unknown', item = null, items = [], title = 'Checkout' } = location.state || {};
  
  // Aggregate items
  const orderItems = items.length > 0 ? items : item ? [item] : [];

  // Mocking membership tier for demonstration (in reality, fetched from user profile)
  // Options: 'nonmember', 'silver', 'gold', 'underage'
  const [membershipTier, setMembershipTier] = useState('nonmember');
  const [showMembershipInfo, setShowMembershipInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [success, setSuccess] = useState(false);

  // Redirect if no items
  useEffect(() => {
    if (orderItems.length === 0) {
      navigate('/courts');
    }
  }, [orderItems, navigate]);

  // Discount Logic
  const getDiscountRate = () => {
    if (membershipTier === 'gold') return 0.20; // 20% off
    if (membershipTier === 'silver') return 0.10; // 10% off
    if (membershipTier === 'underage') return 0.50; // 50% off for junior/underage
    return 0; // nonmember
  };

  const discountRate = getDiscountRate();
  const subtotal = orderItems.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;

  const handlePurchaseMembership = (tier) => {
    // In a real app, this would process a membership purchase API call
    setMembershipTier(tier);
    setShowMembershipInfo(false);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call based on type
      if (type === 'court' && item) {
        await bookingsApi.create({
          court_id: item.court_id,
          slot_id: item.slot_id,
          date: item.date,
          time: item.time,
          payment_method: paymentMethod
        });
      } else {
        // Mock generic delay for shop/bar
        await new Promise(r => setTimeout(r, 1000));
      }
      setSuccess(true);
      setTimeout(() => {
        navigate(type === 'court' ? '/app/bookings' : '/');
      }, 2000);
    } catch (err) {
      alert("Payment failed: " + (err.message || JSON.stringify(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderItems.length === 0) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-brand-surface pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
          <p className="text-slate-500">Your order has been confirmed. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">Complete your secure payment below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: Order Details & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Membership Status Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Membership Status</h3>
                  <button 
                    onClick={() => setShowMembershipInfo(!showMembershipInfo)}
                    className="flex items-center gap-2 hover-lift transition-all text-left"
                  >
                    {membershipTier === 'nonmember' ? (
                      <div className="flex items-center gap-2 text-slate-700">
                        <ShieldAlert className="w-6 h-6 text-rose-500" />
                        <span className="text-xl font-bold">Non-Member</span>
                      </div>
                    ) : membershipTier === 'gold' ? (
                      <div className="flex items-center gap-2 text-amber-600">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="text-xl font-bold">Gold Member</span>
                      </div>
                    ) : membershipTier === 'silver' ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="text-xl font-bold">Silver Member</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-indigo-500">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="text-xl font-bold">Junior (Underage)</span>
                      </div>
                    )}
                    <span className="text-xs text-brand-accent underline underline-offset-2 ml-2">Info</span>
                  </button>
                </div>
              </div>

              {/* Expandable Membership Info / Upgrade */}
              {showMembershipInfo && (
                <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                  {membershipTier === 'nonmember' ? (
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-5">
                      <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-amber-600" /> Upgrade & Save Instantly!
                      </h4>
                      <p className="text-sm text-amber-800 mb-4">Become a member today to unlock up to 20% off courts, shop, and bar items.</p>
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => handlePurchaseMembership('silver')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                          Buy Silver (₹2000/yr)
                        </button>
                        <button onClick={() => handlePurchaseMembership('gold')} className="px-4 py-2 bg-amber-500 rounded-lg text-sm font-bold text-white hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/30">
                          Buy Gold (₹5000/yr)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600 space-y-2">
                      <p>You are currently enjoying your <strong>{membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)}</strong> benefits.</p>
                      <ul className="list-disc list-inside text-emerald-600 font-medium">
                        <li>{discountRate * 100}% discount applied to this order</li>
                        <li>Priority bookings enabled</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'upi' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-bold">UPI / Wallet</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-bold">Credit/Debit Card</span>
                </button>
                
                {/* Cash option ONLY for staff */}
                {user?.role === 'staff' ? (
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'cash' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-6 h-6" />
                    <span className="text-sm font-bold">Cash (Staff)</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/50 text-slate-400 opacity-60 cursor-not-allowed" title="Cash payments must be processed by staff at the front desk">
                    <Banknote className="w-6 h-6" />
                    <span className="text-xs font-bold text-center">Cash <br/>(Front Desk Only)</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COL: Order Summary */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl"></div>
              
              <h3 className="text-lg font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 relative z-10">
                {orderItems.map((oi, i) => (
                  <div key={i} className="flex justify-between items-start text-sm">
                    <div className="pr-4">
                      <p className="font-bold text-slate-100">{oi.name}</p>
                      {oi.desc && <p className="text-slate-400 text-xs mt-0.5">{oi.desc}</p>}
                    </div>
                    <span className="font-medium text-slate-300">₹{oi.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-4 space-y-3 relative z-10">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400 font-medium">
                    <span>Member Discount ({discountRate * 100}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-slate-700">
                  <span>Total</span>
                  <div className="text-right">
                    {discountAmount > 0 && (
                      <span className="text-sm line-through text-slate-500 mr-2 font-normal">₹{subtotal.toFixed(2)}</span>
                    )}
                    <span className="text-white">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConfirmPayment} 
                disabled={isProcessing}
                className="w-full mt-8 bg-brand-accent text-white py-4 rounded-xl font-bold hover:bg-brand-accent-light transition-all hover-lift hover-glow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                {!isProcessing && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-400">
              Payments are secured and encrypted. <br/>By proceeding, you agree to our Terms of Service.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
