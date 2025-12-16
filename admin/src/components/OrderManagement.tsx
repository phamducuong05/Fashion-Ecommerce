import { useState, useEffect } from 'react';
import { Search, Eye, X, CheckCircle, XCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

import axios from 'axios';

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

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'delivered' | 'pending' | 'cancelled'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const getOrderData = async () => {
      const response = await axios.get<Order[]>('/api/order');

      setOrders(response.data);
    }

    getOrderData();
  }, [])

  const updateOrderStatus = async (
    id: string,
    status: 'delivered' | 'cancelled'
  ) => {
    const payload = {
      id,
      status
    }
    await axios.patch(`/api/order/${id}`, payload);
  }

  const optimisticUpdateOrderStatus = async (
    orderId: string,
    nextStatus: 'delivered' | 'cancelled'
  ) => {
    // 1. snapshot
    const previousOrders = [...orders];

    // 2. optimistic update
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: nextStatus }
          : order
      )
    );

    setSelectedOrder(null);

    try {
      // 3. call API
      await updateOrderStatus(orderId, nextStatus);
    } catch (error) {
      // 4. rollback
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

  const filteredOrders = orders.filter(order => {
    const sTerm = searchTerm.toLowerCase();
    const idMatch = order.id?.toString().toLowerCase().includes(sTerm) || false;
    const nameMatch = order.customerName?.toLowerCase().includes(sTerm) || false;
    const emailMatch = order.customerEmail?.toLowerCase().includes(sTerm) || false;
    
    const matchesSearch = idMatch || nameMatch || emailMatch;
    const matchesSection = order.status === activeSection;
    
    return matchesSearch && matchesSection;
  });

  const sections = [
    { id: 'pending' as const, name: 'Pending Confirmation', count: orders.filter(o => o.status === 'pending').length },
    { id: 'delivered' as const, name: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled' as const, name: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#3E2723] mb-2">Order Management</h2>
        <p className="text-[#6F4E37]">Manage and track all customer orders</p>
      </div>

      {/* Search */}
      <div className="bg-[#FFFEF9] rounded-xl shadow-lg p-6 border border-[#D4A574]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0826D] w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-[#FFFEF9] rounded-xl shadow-lg border border-[#D4A574] overflow-hidden">
        <div className="flex border-b border-[#D4A574] overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 px-6 py-4 transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white'
                  : 'text-[#6F4E37] hover:bg-[#FFF8E7]'
              }`}
            >
              <span className="mr-2">{section.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeSection === section.id
                  ? 'bg-white/20'
                  : 'bg-[#F5DEB3] text-[#6F4E37]'
              }`}>
                {section.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No orders found in this section</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-[#FFF8E7]/50 to-[#F5DEB3]/50 rounded-lg border border-[#C19A6B] overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-[#3E2723]">{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status === 'pending' ? 'Pending Confirmation' : 
                             order.status === 'delivered' ? 'Delivered' : 'Cancelled'}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Customer:</strong> {order.customerName} ({order.customerEmail})</p>
                          <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                          <p><strong>Items:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total</p>
                        <p className="text-[#3E2723] mb-3">${order.total.toFixed(2)}</p>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg hover:shadow-md transition-all text-sm"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#D4A574] bg-gradient-to-r from-[#FFF8E7] to-[#F5DEB3]">
              <div>
                <h3 className="text-[#3E2723] mb-1">Order Details - {selectedOrder.id}</h3>
                <p className="text-sm text-gray-600">{new Date(selectedOrder.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-[#3E2723] mb-3">Customer Information</h4>
                <div className="bg-[#FFF8E7] rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-[#3E2723] mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-3 border-b border-[#E8D4B0] last:border-0">
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

              {/* Order Summary */}
              <div className="border-t border-[#D4A574] pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#4E342E]">Order Total:</span>
                  <span className="text-[#3E2723]">${selectedOrder.total.toFixed(2)}</span>
                </div>
                
                {/* Action Buttons */}
                {selectedOrder.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Cancel Order
                    </button>
                    <button
                      onClick={() => handleConfirmOrder(selectedOrder.id)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Delivered
                    </button>
                  </div>
                )}
                
                {selectedOrder.status === 'delivered' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700">
                    <CheckCircle className="w-6 h-6 inline mr-2" />
                    This order has been delivered
                  </div>
                )}
                
                {selectedOrder.status === 'cancelled' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
                    <XCircle className="w-6 h-6 inline mr-2" />
                    This order has been cancelled
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
