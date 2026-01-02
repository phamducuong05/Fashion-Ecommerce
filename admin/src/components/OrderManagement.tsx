import { useState, useEffect } from 'react';
import { Search, Eye, X, CheckCircle, XCircle, } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import axios from 'axios';

/* =======================
   Types
======================= */

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
  status: 'pending' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
}

/* =======================
   Component
======================= */

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<
    'delivered' | 'pending' | 'cancelled'
  >('pending');
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  /* =======================
     Effects
  ======================= */

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const response = await axios.get<Order[]>('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };

    getOrderData();
  }, []);

  /* =======================
     API helpers
  ======================= */

  const updateOrderStatus = async (
    id: string,
    status: 'delivered' | 'cancelled'
  ) => {
    const payload = { id, status };
    await axios.put(`/api/orders/${id}`, payload);
  };

  /* =======================
     Handlers
  ======================= */

  const optimisticUpdateOrderStatus = async (
    orderId: string,
    nextStatus: 'delivered' | 'cancelled'
  ) => {
    const previousOrders = [...orders];

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: nextStatus }
          : order
      )
    );

    setSelectedOrder(null);

    try {
      await updateOrderStatus(orderId, nextStatus);
    } catch (error) {
      console.error(error);
      setOrders(previousOrders);
      alert('Update order status failed. Changes reverted.');
    }
  };

  const handleConfirmOrder = (orderId: string) => {
    if (!confirm('Mark this order as delivered?')) return;
    optimisticUpdateOrderStatus(orderId, 'delivered');
  };

  const handleCancelOrder = (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    optimisticUpdateOrderStatus(orderId, 'cancelled');
  };

  /* =======================
     Derived data
  ======================= */

  const filteredOrders = orders.filter((order) => {
    const sTerm = searchTerm.toLowerCase();

    const idMatch =
      order.id?.toLowerCase().includes(sTerm) ?? false;
    const nameMatch =
      order.customerName?.toLowerCase().includes(sTerm) ??
      false;
    const emailMatch =
      order.customerEmail?.toLowerCase().includes(sTerm) ??
      false;

    const matchesSearch = idMatch || nameMatch || emailMatch;
    const matchesSection = order.status === activeSection;

    return matchesSearch && matchesSection;
  });

  const sections = [
    {
      id: 'pending' as const,
      name: 'Pending Confirmation',
      count: orders.filter((o) => o.status === 'pending').length,
    },
    {
      id: 'delivered' as const,
      name: 'Delivered',
      count: orders.filter((o) => o.status === 'delivered').length,
    },
    {
      id: 'cancelled' as const,
      name: 'Cancelled',
      count: orders.filter((o) => o.status === 'cancelled').length,
    },
  ];

  /* =======================
     Render
  ======================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Order Management</h2>
        <p className="text-gray-600">
          Manage and track all customer orders
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 px-6 py-4 whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{section.name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  activeSection === section.id
                    ? 'bg-white/20'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {section.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="p-6">
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No orders found in this section
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Order ID
                        </p>
                        <p className="text-gray-900">{order.id}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Customer
                        </p>
                        <p className="text-gray-900">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customerEmail}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Date
                        </p>
                        <p className="text-gray-700">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Total
                        </p>
                        <p className="text-gray-900">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>

                      {activeSection === 'pending' && (
                        <>
                          <button
                            onClick={() =>
                              handleConfirmOrder(order.id)
                            }
                            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Confirm
                          </button>

                          <button
                            onClick={() =>
                              handleCancelOrder(order.id)
                            }
                            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                          >
                            <XCircle className="w-4 h-4 inline mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-gray-900 mb-1">
                  Order Details – {selectedOrder.id}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(
                    selectedOrder.date
                  ).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer info */}
              <div>
                <h4 className="text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong>{' '}
                    {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong>Email:</strong>{' '}
                    {selectedOrder.customerEmail}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong>{' '}
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-gray-900 mb-3">
                  Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
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
                          $
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700">
                    Order Total:
                  </span>
                  <span className="text-gray-900">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
