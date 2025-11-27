import { Package, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./imagefallback";

export function OrderHistory() {
  const orders = [
    {
      id: "ORD-2024-1234",
      date: "November 15, 2024",
      status: "Delivered",
      total: 189.99,
      items: [
        {
          name: "Casual Summer Dress",
          image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop",
          size: "M",
          quantity: 1,
          price: 89.99,
        },
        {
          name: "Leather Crossbody Bag",
          image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
          size: "One Size",
          quantity: 1,
          price: 100.0,
        },
      ],
    },
    {
      id: "ORD-2024-1198",
      date: "October 28, 2024",
      status: "Delivered",
      total: 129.99,
      items: [
        {
          name: "Denim Jacket",
          image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
          size: "S",
          quantity: 1,
          price: 129.99,
        },
      ],
    },
    {
      id: "ORD-2024-1156",
      date: "October 12, 2024",
      status: "Delivered",
      total: 249.97,
      items: [
        {
          name: "Wool Blend Coat",
          image:
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop",
          size: "M",
          quantity: 1,
          price: 199.99,
        },
        {
          name: "Silk Scarf",
          image:
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200&h=200&fit=crop",
          size: "One Size",
          quantity: 1,
          price: 49.98,
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Order History</h2>
        <span className="text-gray-500 text-sm">{orders.length} orders</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">{order.id}</p>
                  <p className="text-gray-500 text-sm">{order.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-900">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-gray-600">Total</span>
              <span className="text-gray-900">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
