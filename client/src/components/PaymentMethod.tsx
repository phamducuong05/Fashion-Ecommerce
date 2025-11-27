import { CreditCard, Plus, Edit2, Trash2 } from "lucide-react";

export function PaymentMethods() {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      name: "Emma Richardson",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "09/26",
      name: "Emma Richardson",
      isDefault: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Payment Methods</h2>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 ${
              method.isDefault ? "border-black" : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">
                  {method.type} •••• {method.last4}
                </span>
                {method.isDefault && (
                  <span className="px-2 py-1 text-xs bg-black text-white rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-gray-600 text-sm space-y-1">
              <p>{method.name}</p>
              <p>Expires {method.expiry}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
