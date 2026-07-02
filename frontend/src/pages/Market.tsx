import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Store, MapPin, Search } from 'lucide-react';

export default function Market() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get('/shop');
      if (res.success) setStores(res.data);
    } catch (error) {
      console.error('Failed to fetch stores', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (store.location && store.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-slate-950 text-white pt-16 pb-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">SIMBBiz Marketplace</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Discover incredible local businesses, shop their exclusive products, and support the community.
        </p>
        
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search stores or locations..." 
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-slate-400 shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-12 pb-24 relative z-10">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-slate-500">Loading stores...</div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-slate-500">No stores found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
              <Link 
                key={store._id} 
                to={`/shop/${store.slug}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block flex flex-col"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-inner mb-6 group-hover:scale-110 transition-transform">
                  <Store size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">{store.name}</h2>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-auto">
                  <MapPin size={16} />
                  <span>{store.location || 'Online Store'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
        <p>Powered by <span className="text-teal-400 font-bold tracking-tight">SIMBBiz</span></p>
      </footer>
    </div>
  );
}
