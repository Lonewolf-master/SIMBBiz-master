import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Users, ShoppingBag, CreditCard, Copy, CheckCircle, ExternalLink, Package, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { activeStore } = useAuth();
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_credit: 0,
    sale_count: 0,
    customer_count: 0,
    total_products: 0,
    promo_products: 0
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (activeStore) {
        try {
          const res = await api.get(`/businesses/${activeStore._id}/stats`);
          if (res.success) {
            setStats(res.data);
          }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Revenue" value={`$${stats.total_revenue}`} icon={TrendingUp} color="text-teal-600" bg="bg-teal-50 dark:bg-teal-900/30" />
        <StatCard title="Credit" value={`$${stats.total_credit}`} icon={CreditCard} color="text-rose-600" bg="bg-rose-50 dark:bg-rose-900/30" />
        <StatCard title="Sales" value={stats.sale_count.toString()} icon={ShoppingBag} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard title="Customers" value={stats.customer_count.toString()} icon={Users} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/30" />
        <StatCard title="Products" value={stats.total_products.toString()} icon={Package} color="text-sky-600" bg="bg-sky-50 dark:bg-sky-900/30" />
        <StatCard title="Promos" value={stats.promo_products.toString()} icon={Tag} color="text-fuchsia-600" bg="bg-fuchsia-50 dark:bg-fuchsia-900/30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard/sales" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition">Record Sale</Link>
            <Link to="/dashboard/catalogue" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition">Manage Products</Link>
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
    <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center space-y-3">
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}
