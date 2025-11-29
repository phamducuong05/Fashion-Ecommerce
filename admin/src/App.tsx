import { useState } from 'react';
import { LayoutDashboard, Package, Users, MessageSquare, Menu, X, ShoppingBag, Tag } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { ChatInterface } from './components/ChatInterface';
import { OrderManagement } from './components/OrderManagement';
import { PromotionManagement } from './components/PromotionManagement';

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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF0] via-[#FFF8E7] to-[#F5EBD7]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-gradient-to-b from-[#5C4033] via-[#6F4E37] to-[#5C4033] shadow-2xl`}
      >
        <div className="h-full px-3 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8 px-3">
            <h2 className="text-[#FFF8E7]">Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#F5DEB3] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-[#F5DEB3] text-[#4E342E] shadow-lg'
                        : 'text-[#F5DEB3] hover:bg-[#8B6F47]/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="bg-[#FFFEF9]/95 backdrop-blur-sm shadow-md sticky top-0 z-30 border-b border-[#D4A574]">
          <div className="px-4 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-[#5C4033] hover:bg-[#F5DEB3] transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-[#4E342E]">Admin User</p>
                  <p className="text-xs text-[#8B6F47]">admin@store.com</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A0826D] to-[#8B6F47] flex items-center justify-center text-white shadow-lg">
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