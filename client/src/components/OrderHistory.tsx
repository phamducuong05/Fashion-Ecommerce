import {
  Package,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";
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
      status: "Shipped",
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
      status: "Processing",
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

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return {
          style: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
          dot: "bg-emerald-500",
        };
      case "shipped":
        return {
          style: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Truck,
          dot: "bg-blue-500",
        };
      case "processing":
        return {
          style: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          dot: "bg-amber-500",
        };
      default:
        return {
          style: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Package,
          dot: "bg-gray-500",
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Order History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Check the status of recent orders.
          </p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={order.id}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-300"
            >
              <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{order.id}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.style}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                        />
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {order.date}
                    </div>
                  </div>
                </div>

                <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-1 duration-300">
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start sm:items-center gap-4"
                    >
                      <div className="relative group/image">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            Size: {item.size}
                          </span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
