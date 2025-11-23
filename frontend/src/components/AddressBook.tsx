import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";

export function AddressBook() {
  const addresses = [
    {
      id: 1,
      label: "Home",
      name: "Emma Richardson",
      street: "123 Fashion Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: 2,
      label: "Work",
      name: "Emma Richardson",
      street: "456 Business Plaza, Suite 200",
      city: "New York",
      state: "NY",
      zip: "10002",
      country: "United States",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Address Book</h2>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-lg p-4 ${
              address.isDefault ? "border-black" : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{address.label}</span>
                {address.isDefault && (
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
              <p>{address.name}</p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
              <p>{address.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
