import { useState } from 'react';
import { LayoutDashboard, Package, Users, MessageSquare, Menu, X, ShoppingBag, Tag, Settings } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { ChatInterface } from './components/ChatInterface';
import { OrderManagement } from './components/OrderManagement';
import { PromotionManagement } from './components/PromotionManagement';
import { SettingsPanel } from './components/SettingsPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'promotions', name: 'Promotions', icon: Tag },
    { id: 'chat', name: 'Chat', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-[#1a1d29] shadow-xl`}
      >
        <div className="h-full px-3 py-6 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-8 px-3">
            <div>
              <h2 className="text-white">Adam de Adam</h2>
              <p className="text-gray-400 text-sm">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <ul className="space-y-2 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-[#0f1117] text-white'
                        : 'text-gray-300 hover:bg-[#252837]'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full p-3 rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#0f1117] text-white'
                  : 'text-gray-300 hover:bg-[#252837]'
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
          <div className="px-4 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@store.com</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-md">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'promotions' && <PromotionManagement />}
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}