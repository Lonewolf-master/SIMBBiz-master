import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Store, ExternalLink, Menu, TrendingUp, Tag, ChevronRight, Zap } from 'lucide-react';
import { api } from '../utils/api';

export default function Home() {
  const [data, setData] = useState<any>({ randomProducts: [], latestProducts: [], topStores: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/shop/discover');
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ["Electronics & Tech", "Fashion & Apparel", "Home & Garden", "Real-Estate", "Health & Beauty", "Automotive", "Services", "Groceries"];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center text-slate-900">
              <Zap size={20} className="fill-current" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">SIMBBiz</span>
          </Link>

          {/* Advanced Search Bar */}
          <div className="flex-1 max-w-4xl flex items-center bg-white rounded-lg overflow-hidden focus-within:ring-2 ring-teal-500 h-10 shadow-sm">
            <select 
              className="bg-slate-100 text-slate-700 h-full px-3 text-sm border-r border-slate-300 focus:outline-none cursor-pointer"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            >
              <option>All</option>
              <option>Products</option>
              <option>Stores</option>
              <option>Location</option>
            </select>
            <input 
              type="text" 
              placeholder="Search for products, brands, or stores..." 
              className="flex-1 h-full px-4 text-slate-900 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-teal-500 hover:bg-teal-600 transition-colors h-full px-6 flex items-center justify-center text-slate-900">
              <Search size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="hidden lg:flex flex-col text-sm">
              <span className="text-slate-400 text-xs">Deliver to</span>
              <span className="font-bold flex items-center gap-1"><MapPin size={14}/> Worldwide</span>
            </div>
            <Link to="/login" className="font-semibold hover:text-teal-400 transition">Login</Link>
            <Link to="/signup" className="bg-teal-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-teal-400 transition">Start Selling</Link>
          </div>
        </div>
        
        {/* Secondary Navbar */}
        <div className="bg-slate-800 text-sm px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button className="flex items-center gap-1 font-bold hover:text-teal-400 transition"><Menu size={16}/> All</button>
          <Link to="/market" className="font-medium hover:text-teal-400 transition">All Stores</Link>
          <span className="font-medium hover:text-teal-400 cursor-pointer transition">Today's Deals</span>
          <span className="font-medium hover:text-teal-400 cursor-pointer transition">Customer Service</span>
          <span className="font-medium hover:text-teal-400 cursor-pointer transition">New Releases</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6 flex gap-6">
        
        {/* Left Sidebar (Categories) */}
        <aside className="w-64 flex-shrink-0 hidden xl:block">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-32">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Menu size={18} /> Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat, i) => (
                <li key={i}>
                  <button className="w-full text-left text-sm text-slate-600 hover:text-teal-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition flex items-center justify-between group">
                    {cat}
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading catalog...</p>
            </div>
          ) : (
            <>
              {/* Promotional Banner */}
              <div className="w-full h-64 bg-slate-900 rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50" />
                <div className="absolute z-20 inset-0 p-12 flex flex-col justify-center">
                  <span className="text-teal-400 font-bold mb-2">MEGA SALE</span>
                  <h2 className="text-4xl font-extrabold text-white mb-4">Discover millions of products</h2>
                  <p className="text-slate-300 max-w-md mb-6">Shop directly from independent sellers worldwide with zero platform fees.</p>
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold w-max hover:bg-slate-200 transition">Shop Now</button>
                </div>
              </div>

              {/* Top Stores Row */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Store size={20} className="text-teal-600"/> Featured Stores</h3>
                  <Link to="/market" className="text-sm font-semibold text-teal-600 hover:underline">See all stores</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                  {data.topStores?.map((store: any) => (
                    <Link key={store._id} to={`/shop/${store.slug}`} className="snap-start min-w-[280px] bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-teal-300 transition flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400">
                        <Store size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{store.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{store.description || 'Independent Seller'}</p>
                        {store.category && <span className="inline-block mt-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{store.category}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Latest Deals (Horizontal Scroll) */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Tag size={20} className="text-rose-500"/> Today's Deals</h3>
                  <span className="text-sm font-semibold text-teal-600 cursor-pointer hover:underline">See all deals</span>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                  {data.latestProducts?.map((product: any) => (
                    <ProductCard key={product._id} product={product} business={product.business_id} compact={true} />
                  ))}
                </div>
              </section>

              {/* Just For You (Dense Grid) */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={20} className="text-indigo-500"/> Recommended For You</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {data.randomProducts?.map((product: any) => (
                    <ProductCard key={product._id} product={product} business={product.business} />
                  ))}
                </div>
              </section>

            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-12 border-t border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-white font-bold mb-4">Get to Know Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">About SIMBBiz</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Make Money with Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/signup" className="hover:underline">Sell on SIMBBiz</Link></li>
              <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
              <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Payment Products</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Business Card</a></li>
              <li><a href="#" className="hover:underline">Shop with Points</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Let Us Help You</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Your Account</a></li>
              <li><a href="#" className="hover:underline">Your Orders</a></li>
              <li><a href="#" className="hover:underline">Help & Support</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm border-t border-slate-800 pt-8">
          © 2026 SIMBBiz Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, business, compact = false }: any) {
  const handleOrder = () => {
    if (!business?.phone) return alert('This store has no phone number attached.');
    const text = encodeURIComponent(`Hi, I found this on SIMBBiz and I'd like to order: ${product.name} - $${product.price}`);
    window.open(`https://wa.me/${business.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col ${compact ? 'min-w-[180px] w-[180px]' : 'w-full'}`}>
      {/* Image Container */}
      <div className={`relative bg-slate-100 ${compact ? 'aspect-square' : 'aspect-[4/3]'} group`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover mix-blend-multiply p-2 transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Store size={32} className="opacity-30" />
          </div>
        )}
        
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Store Link */}
        <Link to={`/shop/${business?.slug}`} className="text-[10px] font-medium text-slate-500 hover:text-teal-600 hover:underline mb-1 truncate block">
          {business?.name || 'Unknown Store'}
        </Link>
        
        <h4 className="text-sm font-medium text-slate-800 leading-tight mb-2 line-clamp-2 hover:text-teal-600 cursor-pointer">{product.name}</h4>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-lg font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-xs text-slate-400 line-through">${(product.price / (1 - product.discount/100)).toFixed(2)}</span>
            )}
          </div>
          
          <button 
            onClick={handleOrder}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded transition-colors"
          >
            Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
