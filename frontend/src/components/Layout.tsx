import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Users, DollarSign, PieChart, Settings, Menu, X, Store as StoreIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeStore, stores, switchStore, logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Catalogue', path: '/dashboard/catalogue', icon: Package },
    { name: 'Sales', path: '/dashboard/sales', icon: DollarSign },
    { name: 'Customers', path: '/dashboard/customers', icon: Users },
    { name: 'Reports', path: '/dashboard/reports', icon: PieChart },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-30 transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-teal-400 tracking-tight">SIMBBiz</h1>
            <p className="text-sm text-slate-400 mt-1 truncate max-w-[150px]">{activeStore?.name || 'Loading Store...'}</p>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-teal-500/10 text-teal-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto space-y-2 border-t border-slate-800">
          {user?.role === 'admin' && (
            <Link 
              to="/admin"
              className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition"
            >
              <Users size={20} />
              <span className="font-medium">System Admin</span>
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600 hover:text-teal-600" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 truncate hidden sm:block">
              {navItems.find(item => item.path === location.pathname)?.name || 'SIMBBiz'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200">
              <StoreIcon size={16} className="text-slate-500" />
              <select 
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                value={activeStore?._id || ''}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    navigate('/create-store');
                  } else {
                    switchStore(e.target.value);
                  }
                }}
              >
                {stores.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))}
                <option value="new">+ Create New Store</option>
              </select>
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold uppercase" title={user?.name}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
