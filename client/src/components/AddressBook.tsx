import { MapPin, Plus, Edit2, Trash2, Check } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Address Book
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold bg-black text-white rounded-full hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg active:scale-95">
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
              address.isDefault
                ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20"
                : "border-gray-200 bg-white hover:border-indigo-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    address.isDefault
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{address.label}</h3>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-indigo-600 mt-0.5">
                      <Check className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100/50 pt-4">
              <p className="font-medium text-gray-900 text-base mb-2">
                {address.name}
              </p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
              <div className="pt-2 mt-2 flex items-center gap-2 text-gray-500">
                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                  Phone
                </span>
                {address.phone}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
