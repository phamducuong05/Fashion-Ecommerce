import { useState, useEffect } from 'react';
import { Search, Eye, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

import axios from 'axios';

// Type for data from Backend
interface OrderItem {
  productName: string;
  category: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  imageUrl: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

interface Customer {
  id: number;
  name: string;
  email: string;
  orders: Order[];
  totalSpent: number;
  joinDate: string;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<number | null>(null);

  useEffect(() => {
    const getCustomerData = async () => {
      const reponse = await axios.get<Customer[]>('/api/customers');

      setCustomers(reponse.data);
    }
    getCustomerData();
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#3E2723] mb-2">Customer Management</h2>
        <p className="text-[#6F4E37]">Manage customer information and order details</p>
      </div>

      {/* Search */}
      <div className="bg-[#FFFEF9] rounded-xl shadow-lg p-6 border border-[#D4A574]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0826D] w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-[#FFFEF9] rounded-xl shadow-lg border border-[#D4A574] overflow-hidden"
          >
            {/* Customer Header */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-[#3E2723] mb-1">{customer.name}</h3>
                  <p className="text-sm text-[#6F4E37] mb-2">{customer.email}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-[#6F4E37]">
                      Joined: {new Date(customer.joinDate).toLocaleDateString()}
                    </span>
                    <span className="text-[#8B6F47]">
                      Total Spent: ${customer.totalSpent.toFixed(2)}
                    </span>
                    <span className="text-[#6F4E37]">Orders: {customer.orders.length}</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)
                  }
                  className="px-4 py-2 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View Orders</span>
                  {expandedCustomer === customer.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Orders */}
            {expandedCustomer === customer.id && (
              <div className="border-t border-[#D4A574] bg-gradient-to-br from-[#FFF8E7]/50 to-[#F5DEB3]/50">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-[#8B6F47]" />
                    <h4 className="text-[#3E2723]">Order History</h4>
                  </div>
                  <div className="space-y-4">
                    {customer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-lg shadow border border-[#D4A574] overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="p-4 bg-gradient-to-r from-[#FFF8E7] to-[#F5DEB3] border-b border-[#D4A574]">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="text-[#3E2723]">{order.id}</span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                                <span>Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-[#3E2723]">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4">
                          <div className="space-y-3">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex gap-4 pb-3 border-b border-[#E8D4B0] last:border-0">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#FFF8E7] to-[#F5DEB3] flex-shrink-0">
                                  <ImageWithFallback
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-[#3E2723] mb-1">{item.productName}</h5>
                                  <p className="text-xs text-[#8B6F47] mb-2">{item.category}</p>
                                  <div className="flex flex-wrap gap-2 text-xs text-[#6F4E37]">
                                    <span className="px-2 py-1 bg-[#F5DEB3] rounded">Size: {item.size}</span>
                                    <span className="px-2 py-1 bg-[#F5DEB3] rounded">Color: {item.color}</span>
                                    <span className="px-2 py-1 bg-[#F5DEB3] rounded">Qty: {item.quantity}</span>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                  <p className="text-[#3E2723]">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}