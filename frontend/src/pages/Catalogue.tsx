import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function Catalogue() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    discount: '0',
    min_qty: '1',
    max_qty: ''
  });

  const { activeStore } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [activeStore]);

  const fetchProducts = async () => {
    try {
      if (!activeStore) return setLoading(false);
      
      const res = await api.get(`/businesses/${activeStore._id}/catalogue`);
      setProducts(res.data || []);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data
      });
      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setFormData(prev => ({ ...prev, image_url: uploaded.secure_url }));
      } else {
        setError('Cloudinary upload failed: Make sure your credentials are correct in .env');
      }
    } catch (err) {
      console.error("Image upload failed", err);
      setError('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStore) return;
    if (uploadingImage) return; // Prevent saving while uploading
    setError('');
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: formData.image_url,
        discount: parseFloat(formData.discount) || 0,
        min_qty: parseInt(formData.min_qty) || 1,
        max_qty: formData.max_qty ? parseInt(formData.max_qty) : null,
        in_stock: true
      };

      const res = await api.post(`/businesses/${activeStore._id}/catalogue`, payload);
      
      if (res.success) {
        setIsModalOpen(false);
        setFormData({ name: '', price: '', description: '', image_url: '', discount: '0', min_qty: '1', max_qty: '' });
        await fetchProducts(); // Refresh list instantly
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Product</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Stock</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading catalogue...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No products found. Add your first product to get started!</td></tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 overflow-hidden border border-slate-200">
                          {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover"/> : <ImageIcon size={20}/>}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 flex items-center gap-2">
                            {product.name}
                            {product.discount > 0 && <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">-{product.discount}%</span>}
                          </p>
                          <p className="text-sm text-slate-500">{product.category_id?.name || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">${product.price}</td>
                    <td className="px-6 py-4">
                      {product.in_stock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">In Stock</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-teal-600 transition"><Edit2 size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 transition"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Add New Product</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 overflow-y-auto flex-1 space-y-5">
              {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm">{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="E.g. Premium Coffee Beans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($) *</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount / Promotion (%)</label>
                  <input 
                    type="number" min="0" max="100"
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min. Order Qty</label>
                  <input 
                    type="number" min="1"
                    value={formData.min_qty}
                    onChange={e => setFormData({...formData, min_qty: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max. Order Qty</label>
                  <input 
                    type="number" min="1"
                    value={formData.max_qty}
                    onChange={e => setFormData({...formData, max_qty: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="No limit"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                  <div className="flex items-center gap-4">
                    {formData.image_url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition"
                    />
                  </div>
                  {uploadingImage && <p className="text-xs text-teal-600 mt-2 font-medium">Uploading image to Cloudinary...</p>}
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
