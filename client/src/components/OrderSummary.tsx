import { Tag, MapPin, CreditCard, Wallet, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Address {
  id: number;
  recipientName: string;
  phone: string;
  city: string;
  district: string | null;
  ward: string | null;
  detail: string;
  isDefault: boolean;
}

export interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  onApplyDiscount: (code: string) => void;
  onCheckout: (addressId: number, paymentMethod: string) => void;
  isProcessing?: boolean;
}

export function OrderSummary({
  subtotal,
  shipping,
  discount,
  onApplyDiscount,
  onCheckout,
  isProcessing = false,
}: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "COD" | "ONLINE" | null
  >(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const total = subtotal + shipping - discount;

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingAddresses(false);
        return;
      }

      try {
        const res = await fetch("/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);

          // Auto-select default address if exists
          const defaultAddr = data.find((addr: Address) => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      onApplyDiscount(discountCode);
      setIsApplied(true);
    }
  };

  const handleCheckoutClick = () => {
    if (selectedAddressId && selectedPaymentMethod) {
      onCheckout(selectedAddressId, selectedPaymentMethod);
    }
  };

  const canCheckout =
    selectedAddressId && selectedPaymentMethod && !isProcessing;

  const formatAddress = (addr: Address) => {
    const parts = [addr.detail];
    if (addr.ward) parts.push(addr.ward);
    if (addr.district) parts.push(addr.district);
    parts.push(addr.city);
    return parts.join(", ");
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="font-medium text-gray-900 mb-4">Order Summary</h2>

      {/* Shipping Address Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Shipping Address
        </label>
        {loadingAddresses ? (
          <div className="text-sm text-gray-500 py-2">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            No saved addresses. Please add an address from your profile.
          </div>
        ) : (
          <select
            value={selectedAddressId || ""}
            onChange={(e) => setSelectedAddressId(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Select delivery address</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.recipientName} - {addr.phone} - {formatAddress(addr)}
                {addr.isDefault ? " (Default)" : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="space-y-2">
          {/* COD Option */}
          <label
            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
              selectedPaymentMethod === "COD"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={selectedPaymentMethod === "COD"}
              onChange={(e) =>
                setSelectedPaymentMethod(e.target.value as "COD")
              }
              className="w-4 h-4 text-indigo-600"
            />
            <Wallet className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Cash on Delivery</div>
              <div className="text-xs text-gray-500">Pay when you receive</div>
            </div>
          </label>

          {/* Online Payment Option */}
          <label
            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
              selectedPaymentMethod === "ONLINE"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="ONLINE"
              checked={selectedPaymentMethod === "ONLINE"}
              onChange={(e) =>
                setSelectedPaymentMethod(e.target.value as "ONLINE")
              }
              className="w-4 h-4 text-indigo-600"
            />
            <CreditCard className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Online Payment</div>
              <div className="text-xs text-gray-500">VNPay / Bank Transfer</div>
            </div>
          </label>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckoutClick}
        disabled={!canCheckout}
        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Proceed to Checkout"
        )}
      </button>

      {!canCheckout && !isProcessing && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Please select address and payment method
        </p>
      )}
    </div>
  );
}
