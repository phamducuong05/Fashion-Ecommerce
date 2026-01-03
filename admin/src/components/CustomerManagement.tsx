import { useState, useEffect } from 'react';
import { Search, Eye, Package, ChevronDown, ChevronUp, } from 'lucide-react';
import axios from 'axios';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
      try {
        const response = await axios.get<Customer[]>('/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    getCustomerData();
  }, []);

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
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
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
      <div>
        <h2 className="text-gray-900 mb-2">Customer Management</h2>
        <p className="text-gray-600">
          Manage customer information and order details
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{customer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{customer.email}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-600">
                      Joined:{' '}
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </span>
                    <span className="text-gray-700">
                      Total Spent: ${customer.totalSpent.toFixed(2)}
                    </span>
                    <span className="text-gray-600">
                      Orders: {customer.orders.length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setExpandedCustomer(
                      expandedCustomer === customer.id ? null : customer.id
                    )
                  }
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
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

            {/* Order History */}
            {expandedCustomer === customer.id && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h4 className="text-gray-900">Order History</h4>
                  </div>

                  <div className="space-y-4">
                    {customer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="text-gray-900">
                                  {order.id}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>
                                  Date:{' '}
                                  {new Date(order.date).toLocaleDateString()}
                                </span>
                                <span>
                                  Items:{' '}
                                  {order.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-gray-900">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <ImageWithFallback
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h5 className="text-gray-900 mb-1">
                                  {item.productName}
                                </h5>
                                <p className="text-xs text-gray-600 mb-2">
                                  {item.category}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                  <span>Size: {item.size}</span>
                                  <span>•</span>
                                  <span>Color: {item.color}</span>
                                  <span>•</span>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  ${item.price.toFixed(2)} each
                                </p>
                                <p className="text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
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
