import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      if (res.success) {
        await login({ ...res.data, token: res.token });
        navigate('/create-store');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white flex font-sans w-full">
      
      {/* Left Side: Wallpaper & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-slate-900/95 to-slate-900/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=1600&auto=format&fit=crop&q=80" 
          alt="E-commerce Success" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        <div className="relative z-20 w-full h-full flex flex-col justify-between p-16">
          <Link to="/" className="flex items-center gap-3 w-max">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-teal-600 shadow-lg shadow-white/20">
              <Zap size={24} className="fill-current" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">SIMBBiz</span>
          </Link>
          
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-8">
              Start selling to millions of customers globally.
            </h1>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Zero Platform Fees</h3>
                  <p className="text-slate-300">Keep 100% of your revenue. We connect you directly to buyers via WhatsApp.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Multi-Store Management</h3>
                  <p className="text-slate-300">Run your fashion, tech, and real estate businesses all from one single dashboard.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Advanced Analytics</h3>
                  <p className="text-slate-300">Track your store views, clicks, and catalogue performance in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-slate-900 shadow-lg shadow-teal-500/20">
                <Zap size={28} className="fill-current" />
              </Link>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create your account</h2>
            <p className="text-slate-500">Join thousands of successful sellers on SIMBBiz.</p>
          </div>

          <form className="space-y-6 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input 
                  name="name" type="text" required value={formData.name} onChange={handleChange}
                  className="appearance-none block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors sm:text-sm font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input 
                  name="email" type="email" required value={formData.email} onChange={handleChange}
                  className="appearance-none block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors sm:text-sm font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input 
                  name="password" type="password" required value={formData.password} onChange={handleChange}
                  className="appearance-none block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-teal-500 hover:text-slate-900 hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
            
            <p className="text-xs text-slate-500 text-center mt-4">
              By creating an account, you agree to our <a href="#" className="underline hover:text-slate-800">Terms of Service</a> and <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have a seller account? <Link to="/login" className="font-bold text-teal-600 hover:text-teal-500 hover:underline transition-colors">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
