import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight, Loader2, Star } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      if (res.success) {
        await login({ ...res.data, token: res.token });
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white flex font-sans w-full">
      
      {/* Left Side: Wallpaper & Welcome Words */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-900/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=1600&auto=format&fit=crop&q=80" 
          alt="Business Workspace" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        <div className="relative z-20 w-full h-full flex flex-col justify-between p-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-900">
              <Zap size={24} className="fill-current" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">SIMBBiz</span>
          </Link>
          
          <div className="max-w-xl">
            <div className="flex items-center gap-1 mb-6 text-amber-400">
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Manage your global enterprise from anywhere.
            </h1>
            <p className="text-xl text-slate-300 mb-12">
              "Since moving to SIMBBiz, our cross-border sales have increased by 300%. The analytics and storefront tools are absolutely world-class."
            </p>
            
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-slate-700" />
              <div>
                <p className="text-white font-bold">Alexander Wright</p>
                <p className="text-slate-400 text-sm">CEO, TechHaven International</p>
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
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to your seller dashboard to manage your stores and orders.</p>
          </div>

          <form className="space-y-6 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                {error}
              </div>
            )}
            
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-semibold text-teal-600 hover:text-teal-500">Forgot password?</Link>
              </div>
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
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In to Dashboard'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have a seller account? <Link to="/signup" className="font-bold text-teal-600 hover:text-teal-500 hover:underline transition-colors">Apply to sell today</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
