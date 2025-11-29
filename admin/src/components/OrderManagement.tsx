import { useState } from 'react';
import { Search, Eye, X, CheckCircle, XCircle } from 'lucide-react';
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
  status: 'pending' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    date: '2024-11-20',
    total: 299.98,
    status: 'delivered',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        productName: 'Classic Cotton T-Shirt',
        category: 'Men - T-Shirts',
        quantity: 2,
        price: 29.99,
        size: 'M',
        color: 'Black',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
      },
      {
        productName: 'Leather Crossbody Bag',
        category: 'Bags',
        quantity: 1,
        price: 129.99,
        size: 'One Size',
        color: 'Brown',
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'
      }
    ]
  },
  {
    id: 'ORD-1002',
    date: '2024-11-25',
    total: 149.97,
    status: 'delivered',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        productName: 'Floral Summer Dress',
        category: 'Women - Dress',
        quantity: 1,
        price: 89.99,
        size: 'S',
        color: 'Floral Blue',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'
      },
      {
        productName: 'Casual Sneakers',
        category: 'Women - Shoes',
        quantity: 1,
        price: 59.99,
        size: 'M',
        color: 'White',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
      }
    ]
  },
  {
    id: 'ORD-1003',
    date: '2024-11-27',
    total: 799.99,
    status: 'pending',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        productName: 'Premium Wool Coat',
        category: 'Women - Top',
        quantity: 1,
        price: 399.99,
        size: 'M',
        color: 'Camel',
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400'
      },
      {
        productName: 'Designer Handbag',
        category: 'Bags',
        quantity: 1,
        price: 400.00,
        size: 'One Size',
        color: 'Black',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'
      }
    ]
  },
  {
    id: 'ORD-1004',
    date: '2024-11-18',
    total: 599.97,
    status: 'delivered',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@email.com',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    items: [
      {
        productName: 'Slim Fit Jeans',
        category: 'Men - Jeans',
        quantity: 3,
        price: 79.99,
        size: 'L',
        color: 'Dark Blue',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
      },
      {
        productName: 'Polo Shirt',
        category: 'Men - Polo',
        quantity: 2,
        price: 45.99,
        size: 'L',
        color: 'Navy',
        imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'
      }
    ]
  },
  {
    id: 'ORD-1005',
    date: '2024-11-24',
    total: 249.98,
    status: 'delivered',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@email.com',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    items: [
      {
        productName: 'Hooded Sweatshirt',
        category: 'Men - Hoodie',
        quantity: 2,
        price: 69.99,
        size: 'XL',
        color: 'Gray',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
      },
      {
        productName: 'Baseball Cap',
        category: 'Hats',
        quantity: 1,
        price: 24.99,
        size: 'One Size',
        color: 'Black',
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'
      }
    ]
  },
  {
    id: 'ORD-1006',
    date: '2024-11-26',
    total: 99.99,
    status: 'pending',
    customerName: 'Emma Davis',
    customerEmail: 'emma.davis@email.com',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    items: [
      {
        productName: 'Yoga Leggings',
        category: 'Women - Legging',
        quantity: 1,
        price: 49.99,
        size: 'M',
        color: 'Black',
        imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'
      },
      {
        productName: 'Athletic Top',
        category: 'Women - Top',
        quantity: 1,
        price: 39.99,
        size: 'S',
        color: 'Pink',
        imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400'
      }
    ]
  },
  {
    id: 'ORD-1007',
    date: '2024-11-22',
    total: 200.00,
    status: 'cancelled',
    customerName: 'James Wilson',
    customerEmail: 'jwilson@email.com',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    items: [
      {
        productName: 'Winter Jacket',
        category: 'Men - Sweater',
        quantity: 1,
        price: 200.00,
        size: 'L',
        color: 'Navy',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'
      }
    ]
  },
  {
    id: 'ORD-1008',
    date: '2024-11-27',
    total: 179.97,
    status: 'pending',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@email.com',
    shippingAddress: '555 Maple Dr, Seattle, WA 98101',
    items: [
      {
        productName: 'Leather Wallet',
        category: 'Wallets',
        quantity: 2,
        price: 49.99,
        size: 'One Size',
        color: 'Brown',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'
      },
      {
        productName: 'Denim Skirt',
        category: 'Women - Skirt',
        quantity: 1,
        price: 79.99,
        size: 'M',
        color: 'Light Blue',
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400'
      }
    ]
  },
];

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'delivered' | 'pending' | 'cancelled'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleConfirmOrder = (orderId: string) => {
    if (confirm('Mark this order as delivered?')) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'delivered' as const } : order
      ));
      setSelectedOrder(null);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      ));
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
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
