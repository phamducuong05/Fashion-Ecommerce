import { useState, useEffect } from "react";
import { Link } from "react-router";
import { API_URL } from "../config";
import { Package, ChevronRight } from "lucide-react";

interface OrderItem {
    id: number;
    variant: {
        product: {
            name: string;
            thumbnail: string | null;
        }
    }
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: string; // Decimal comes as string usually
  finalAmount: string;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <Link
            to="/products"
            className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Placed</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{Number(order.finalAmount || order.totalAmount).toLocaleString()} đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order #</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div className="md:text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {order.status}
                    </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-4 overflow-hidden">
                    {order.items.slice(0, 3).map((item, idx) => (
                         <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                            {item.variant.product.thumbnail ? (
                                <img src={item.variant.product.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                            )}
                         </div>
                    ))}
                    {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            +{order.items.length - 3}
                        </div>
                    )}
                </div>
                {/* 
                <Link to={`/orders/${order.id}`} className="flex items-center text-[#646cff] font-medium hover:underline">
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                 */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
