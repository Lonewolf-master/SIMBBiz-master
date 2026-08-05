import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, CreditCard, Package, CheckCircle2, ShieldCheck, Phone, Info, Zap, Check } from 'lucide-react';
import { api } from '../utils/api';

export default function Billing() {
  const { activeStore } = useAuth();
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);
  
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const [spacesToBuy, setSpacesToBuy] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans');
        if (res.success) {
          setPlans(res.data);
        }
      } catch (e) {
        console.error("Could not fetch plans", e);
      }
    };
    fetchPlans();
  }, []);

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
      const payload: any = {
        payment_method: paymentMethod,
        phone_or_card: phoneNumber
      };
      
      if (selectedPlanId !== 'custom') {
        payload.plan_id = selectedPlanId;
      } else {
        payload.spaces = spacesToBuy;
      }

      const res = await api.post(`/businesses/${activeStore._id}/buy-spaces`, payload);
      if (res.success) {
        setSuccess(res.message || `Payment initiated!`);
      } else {
        setError(res.error || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Payment failed due to an unexpected error.');
    } finally {
      setBuyLoading(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 8000);
    }
  };
  
  const getSelectedTotal = () => {
    if (selectedPlanId && selectedPlanId !== 'custom') {
      const plan = plans.find(p => p._id === selectedPlanId);
      return plan ? plan.price : 0;
    }
    return spacesToBuy * 200;
  };

  // Set default plan selection when plans load
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0]._id);
    } else if (plans.length === 0 && !selectedPlanId) {
      setSelectedPlanId('custom');
    }
  }, [plans]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500 tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Scale your business seamlessly. Purchase additional capacity and manage your store securely.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-5 rounded-2xl flex items-start gap-4 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="mt-0.5 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-lg tracking-wide">Transaction Initiated</h4>
            <p className="mt-1 font-medium">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-5 rounded-2xl flex items-start gap-4 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-4">
          <Info className="mt-0.5 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-lg tracking-wide">Transaction Issue</h4>
            <p className="mt-1 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Current Status */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-colors" />
            <div className="absolute -top-4 -right-4 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <Package size={160} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="p-3 bg-teal-500/10 rounded-xl text-teal-500"><Package size={24} /></div>
              Store Capacity
            </h3>
            
            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">Current Plan</p>
                <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-700 dark:text-teal-400 font-bold text-sm tracking-wide shadow-inner uppercase">
                  {activeStore?.subscription_plan || 'Free Tier'}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">Available Slots</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">
                    {activeStore?.item_slots_available !== undefined ? activeStore.item_slots_available : 5}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold text-lg uppercase tracking-widest">items</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-slate-800 dark:to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl border border-indigo-500/20 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <ShieldCheck className="text-indigo-200 dark:text-indigo-400 mb-6 drop-shadow-md relative z-10" size={40} />
            <h3 className="text-xl font-bold mb-3 relative z-10 tracking-wide">Secure Payments</h3>
            <p className="text-indigo-100 dark:text-slate-400 text-sm leading-relaxed font-medium relative z-10">
              All transactions are encrypted and securely processed by our payment gateway partners. We natively support MTN MoMo and Orange Money Cameroon.
            </p>
          </div>
        </div>

        {/* Right Column: Payment Form & Plans */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 h-full relative overflow-hidden">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Purchase Capacity</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">Select a premium plan or purchase custom item slots.</p>

            <form onSubmit={handleBuySpaces} className="space-y-10 relative z-10">
              
              {/* Plans Selection */}
              {plans.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Select Package</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(p => (
                      <div 
                        key={p._id} 
                        onClick={() => setSelectedPlanId(p._id)}
                        className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative ${selectedPlanId === p._id ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10 shadow-lg shadow-teal-500/10 transform scale-[1.02]' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-teal-500/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      >
                        {selectedPlanId === p._id && (
                          <div className="absolute top-4 right-4 text-teal-500 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                            <CheckCircle2 size={24} className="fill-current text-white dark:text-slate-900 stroke-teal-500" />
                          </div>
                        )}
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">{p.name}</h4>
                        <div className="mt-2 mb-4">
                          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 tracking-tight">{p.price.toLocaleString()}</span>
                          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">FCFA</span>
                        </div>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <Check size={16} className="text-teal-500" /> {p.slots} Product Slots
                          </li>
                          <li className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <Check size={16} className="text-teal-500" /> {p.description || 'Premium Support'}
                          </li>
                        </ul>
                      </div>
                    ))}

                    <div 
                      onClick={() => setSelectedPlanId('custom')}
                      className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative ${selectedPlanId === 'custom' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/10 transform scale-[1.02]' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      {selectedPlanId === 'custom' && (
                        <div className="absolute top-4 right-4 text-indigo-500 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                          <CheckCircle2 size={24} className="fill-current text-white dark:text-slate-900 stroke-indigo-500" />
                        </div>
                      )}
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Custom Slots</h4>
                      <div className="mt-2 mb-4">
                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tight">200</span>
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">FCFA / item</span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4 h-11">
                        Pay exactly for what you need. Buy slots individually.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Spaces Input (Only show if 'custom' is selected) */}
              {(!plans.length || selectedPlanId === 'custom') && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                    Number of Spaces
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Package className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
                    </div>
                    <input 
                      type="number"
                      min="5"
                      value={spacesToBuy} 
                      onChange={e => setSpacesToBuy(Math.max(5, Number(e.target.value)))}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-white font-black text-xl"
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">Minimum purchase is 5 spaces.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Method Select */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                    Payment Method
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <CreditCard className="text-slate-400 group-focus-within:text-teal-500 transition-colors" size={22} />
                    </div>
                    <select 
                      value={paymentMethod} 
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all dark:text-white font-bold text-lg appearance-none cursor-pointer"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="ORANGE">Orange Money</option>
                      <option value="VIRTUAL_CARD">Virtual Card (Soon)</option>
                    </select>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                    Phone Number (MoMo)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Phone className="text-slate-400 group-focus-within:text-teal-500 transition-colors" size={22} />
                    </div>
                    <input 
                      type="tel"
                      placeholder="e.g. 670000000"
                      value={phoneNumber} 
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all dark:text-white font-bold text-lg"
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">Required to receive the payment prompt.</p>
                </div>
              </div>

              {/* Order Summary & Submit */}
              <div className="pt-8 mt-10 border-t border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center justify-between mb-8 bg-slate-50 dark:bg-black/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Total Checkout</span>
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {getSelectedTotal().toLocaleString()} <span className="text-xl text-teal-600 dark:text-teal-400 uppercase">FCFA</span>
                  </span>
                </div>
                
                <button 
                  type="submit" 
                  disabled={buyLoading} 
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-900 px-8 py-5 rounded-2xl font-black text-lg tracking-widest uppercase transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/30 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                >
                  {buyLoading ? (
                    <><Loader2 size={24} className="animate-spin" /> Verifying...</>
                  ) : (
                    <><Zap size={24} strokeWidth={2.5} /> Pay Securely</>
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
