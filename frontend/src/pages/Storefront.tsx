import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, MapPin, Phone } from 'lucide-react';

export default function Storefront() {
  const { slug } = useParams();
  const [shopData, setShopData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShop();
  }, [slug]);

  const fetchShop = async () => {
    try {
      const res = await api.get(`/shop/${slug}`);
      setShopData(res.data);
    } catch (error) {
      console.error('Failed to fetch shop data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading shop...</div>;
  if (!shopData) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-rose-500">Shop not found.</div>;

  const { business, categories, uncategorised } = shopData;

  const filterProducts = (products: any[]) => 
    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/market" className="text-teal-600 text-sm font-medium hover:underline mb-1 inline-block">&larr; Back to Market</Link>
            <h1 className="text-2xl font-extrabold text-slate-800 leading-tight">{business.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
              {business.location && <span className="flex items-center gap-1"><MapPin size={14} /> {business.location}</span>}
              {business.phone && <span className="flex items-center gap-1"><Phone size={14} /> {business.phone}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full md:w-64 pl-9 pr-4 py-2 bg-slate-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-12 flex-1">
        {categories?.map((cat: any) => {
          const catProducts = filterProducts(cat.products || []);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat._id}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {cat.name} <span className="text-sm font-normal text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{catProducts.length}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {catProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} business={business} />
                ))}
              </div>
            </section>
          );
        })}

        {uncategorised && filterProducts(uncategorised).length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Other Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterProducts(uncategorised).map((product: any) => (
                <ProductCard key={product._id} product={product} business={business} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
        <p>Powered by <Link to="/" className="text-teal-400 font-bold tracking-tight hover:underline">SIMBBiz</Link></p>
      </footer>
    </div>
  );
}

function ProductCard({ product, business }: any) {
  const handleOrder = () => {
    const text = encodeURIComponent(`Hi, I would like to order: ${product.name} - $${product.price}`);
    window.open(`https://wa.me/${business.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-teal-200 transition-all group flex flex-col">
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 font-medium text-sm">No Image</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-slate-800 leading-tight mb-1">{product.name}</h3>
        {product.description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description}</p>}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-teal-600">${product.price}</span>
          <button 
            onClick={handleOrder}
            className="text-sm font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-teal-600 transition flex items-center gap-1"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
}
