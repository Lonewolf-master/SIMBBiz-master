import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Users, ShoppingBag, CreditCard, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { activeStore } = useAuth();
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_credit: 0,
    sale_count: 0,
    customer_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (activeStore) {
        try {
          // Mocking stats for now (until reports API is fully active)
          setStats({ total_revenue: 12500, total_credit: 4200, sale_count: 84, customer_count: 12 });
        } catch (error) {
          console.error("Error fetching dashboard data", error);
        }
      }
      setLoading(false);
    };
    
    fetchDashboardData();
  }, [activeStore]);

  const handleCopyLink = () => {
    if (!activeStore) return;
    const link = `${window.location.origin}/shop/${activeStore.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-slate-500">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.total_revenue}`} icon={TrendingUp} color="text-teal-600" bg="bg-teal-50" />
        <StatCard title="Total Credit" value={`$${stats.total_credit}`} icon={CreditCard} color="text-rose-600" bg="bg-rose-50" />
        <StatCard title="Total Sales" value={stats.sale_count.toString()} icon={ShoppingBag} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Customers" value={stats.customer_count.toString()} icon={Users} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition">Record Sale</button>
            <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition">Add Product</button>
          </div>
        </div>

        {/* Share Store Link Box */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 shadow-md text-white">
          <h3 className="text-lg font-semibold mb-2">Your Public Storefront</h3>
          <p className="text-slate-400 text-sm mb-4">Share this link with your customers so they can view your catalogue and order via WhatsApp.</p>
          
          {activeStore ? (
            <div className="flex items-center gap-2">
              <div className="bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 flex-1 overflow-hidden">
                <p className="text-teal-400 font-mono text-sm truncate">{window.location.origin}/shop/{activeStore.slug}</p>
              </div>
              <button 
                onClick={handleCopyLink}
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 p-3 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center"
                title="Copy Link"
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
              <Link 
                to={`/shop/${activeStore.slug}`} 
                target="_blank"
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center"
                title="Open Storefront"
              >
                <ExternalLink size={20} />
              </Link>
            </div>
          ) : (
            <p className="text-amber-400 text-sm">Please finish setting up your store to generate a link.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
