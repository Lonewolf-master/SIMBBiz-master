import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Users, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-teal-500/30 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-slate-950">
              <Zap size={20} className="fill-current" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">SIMBBiz</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              to="/login" 
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="text-sm font-semibold bg-white text-slate-950 hover:bg-slate-200 px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-teal-400 font-medium mb-8 backdrop-blur-sm shadow-xl">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          SIMBBiz Platform 2.0 is live
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 max-w-4xl leading-tight tracking-tight">
          Run your entire business <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
            from a single dashboard
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          The ultimate platform to track sales, manage inventory, understand your customers, and launch a stunning public storefront in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/signup" 
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] hover:-translate-y-1"
          >
            Start for free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Floating UI Elements Mockup */}
        <div className="mt-20 relative w-full max-w-5xl aspect-[16/9] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center group perspective-1000">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          <div className="w-[80%] h-[80%] rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col group-hover:rotate-x-[2deg] group-hover:rotate-y-[-2deg] transition-transform duration-700">
            {/* Mock Header */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            {/* Mock Body */}
            <div className="flex-1 p-6 flex gap-6 opacity-50">
               <div className="w-1/4 rounded-lg bg-white/5 space-y-4 p-4">
                 <div className="h-4 bg-white/10 rounded w-3/4" />
                 <div className="h-4 bg-white/10 rounded w-1/2" />
                 <div className="h-4 bg-white/10 rounded w-5/6" />
               </div>
               <div className="flex-1 flex flex-col gap-4">
                 <div className="flex gap-4">
                   <div className="flex-1 h-24 rounded-lg bg-teal-500/20 border border-teal-500/30" />
                   <div className="flex-1 h-24 rounded-lg bg-indigo-500/20 border border-indigo-500/30" />
                   <div className="flex-1 h-24 rounded-lg bg-rose-500/20 border border-rose-500/30" />
                 </div>
                 <div className="flex-1 rounded-lg bg-white/5" />
               </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left w-full">
          <FeatureCard 
            icon={TrendingUp} title="Financial Clarity" 
            desc="Keep a pulse on your daily revenue, credit sales, and operational costs with powerful analytics."
          />
          <FeatureCard 
            icon={Globe} title="Instant Storefront" 
            desc="Generate a public, mobile-optimized catalogue link to receive orders instantly via WhatsApp."
          />
          <FeatureCard 
            icon={Shield} title="Multi-Store Control" 
            desc="Manage multiple businesses from a single account with enterprise-grade security and isolation."
          />
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-slate-950 py-10 text-center text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-slate-950">
            <Zap size={14} className="fill-current" />
          </div>
          © 2026 SIMBBiz. Crafted for modern commerce.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="group relative bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors backdrop-blur-md overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon size={120} />
      </div>
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
          <Icon size={26} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}
