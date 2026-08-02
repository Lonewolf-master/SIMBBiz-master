import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, CreditCard, Package, CheckCircle2, ShieldCheck, Phone, Info } from 'lucide-react';
import { api } from '../utils/api';

export default function Billing() {
  const { activeStore } = useAuth();
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);
  const [spacesToBuy, setSpacesToBuy] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBuySpaces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStore) return;
    
    if ((paymentMethod === 'MTN' || paymentMethod === 'ORANGE') && !phoneNumber) {
      setError('Phone number is required for Mobile Money payments.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setBuyLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await api.post(`/businesses/${activeStore._id}/buy-spaces`, {
        spaces: spacesToBuy,
        payment_method: paymentMethod,
        phone_or_card: phoneNumber
      });
      if (res.success) {
        setSuccess(res.message || `Payment initiated! Receipt: ${res.data.payment.transaction_reference}`);
        // We do not await refreshStores() immediately because it takes time for the webhook to update the DB
      } else {
        setError(res.error || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Payment failed due to an unexpected error.');
    } finally {
      setBuyLoading(false);
      // Auto-hide messages after 8 seconds
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 8000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 pt-4 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 tracking-tight">
          Billing & Subscriptions
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Scale your business seamlessly. Purchase additional capacity and manage your store securely.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-5 rounded-2xl flex items-start gap-4 shadow-sm backdrop-blur-sm animate-fade-in-up">
          <CheckCircle2 className="mt-0.5 shrink-0" size={24} />
          <div>
            <h4 className="font-semibold text-lg">Transaction Completed</h4>
            <p className="mt-1 opacity-90">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 p-5 rounded-2xl flex items-start gap-4 shadow-sm backdrop-blur-sm animate-fade-in-up">
          <Info className="mt-0.5 shrink-0" size={24} />
          <div>
            <h4 className="font-semibold text-lg">Transaction Issue</h4>
            <p className="mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package size={120} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Package className="text-teal-500" /> Store Capacity
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Current Plan</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-semibold text-sm capitalize">
                  {activeStore?.subscription_plan || 'Free Tier'}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Available Slots</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
                    {activeStore?.item_slots_available !== undefined ? activeStore.item_slots_available : 5}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">items</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <ShieldCheck className="text-teal-400 mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              All transactions are encrypted and securely processed by our payment gateway partners. We support MTN MoMo and Orange Money Cameroon.
            </p>
          </div>
        </div>

        {/* Right Column: Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800 h-full">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Purchase Spaces</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Increase your store capacity instantly. 1 space = 200 FCFA.</p>

            <form onSubmit={handleBuySpaces} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Spaces Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Number of Spaces
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Package className="text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    </div>
                    <input 
                      type="number"
                      min="5"
                      value={spacesToBuy} 
                      onChange={e => setSpacesToBuy(Math.max(5, Number(e.target.value)))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all dark:text-white font-semibold text-lg"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Minimum purchase is 5 spaces.</p>
                </div>

                {/* Payment Method Select */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Payment Method
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CreditCard className="text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    </div>
                    <select 
                      value={paymentMethod} 
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all dark:text-white font-semibold text-lg appearance-none cursor-pointer"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="ORANGE">Orange Money</option>
                      <option value="VIRTUAL_CARD">Virtual Card (Soon)</option>
                    </select>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number (MTN/Orange)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    </div>
                    <input 
                      type="tel"
                      placeholder="e.g. 670000000"
                      value={phoneNumber} 
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all dark:text-white font-semibold text-lg"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Required to receive the payment prompt on your phone.</p>
                </div>
              </div>

              {/* Order Summary & Submit */}
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-medium text-slate-600 dark:text-slate-300">Total Amount</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {(spacesToBuy * 200).toLocaleString()} <span className="text-xl text-teal-600 dark:text-teal-400">FCFA</span>
                  </span>
                </div>
                
                <button 
                  type="submit" 
                  disabled={buyLoading} 
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/30 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                >
                  {buyLoading ? (
                    <><Loader2 size={24} className="animate-spin" /> Processing Payment...</>
                  ) : (
                    <><CreditCard size={24} /> Pay Now</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
