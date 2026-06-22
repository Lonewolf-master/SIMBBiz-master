import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Users, Store, TrendingUp, DollarSign, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    total_sales: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.success) setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminStats();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-500">Loading system data...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">System Admin Console</h1>
            <p className="text-slate-400 mt-1">Platform-wide aggregates and metrics.</p>
          </div>
          <Link to="/dashboard" className="flex items-center gap-2 text-teal-400 hover:text-teal-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition">
            <ArrowLeft size={18} /> Back to My Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Registered Users" value={stats.users.toString()} icon={Users} color="text-indigo-400" border="border-indigo-500/30" bg="bg-indigo-500/10" />
          <StatCard title="Active Businesses" value={stats.stores.toString()} icon={Store} color="text-amber-400" border="border-amber-500/30" bg="bg-amber-500/10" />
          <StatCard title="Platform Sales Volume" value={stats.total_sales.toString()} icon={TrendingUp} color="text-teal-400" border="border-teal-500/30" bg="bg-teal-500/10" />
          <StatCard title="Gross Platform Revenue" value={`$${stats.total_revenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-400" border="border-emerald-500/30" bg="bg-emerald-500/10" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, border }: any) {
  return (
    <div className={`bg-white/5 p-6 rounded-2xl border ${border} shadow-lg backdrop-blur-sm flex items-center space-x-4`}>
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
