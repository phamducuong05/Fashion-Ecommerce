import { Tag } from "lucide-react";
import { useState } from "react";

export interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  onApplyDiscount: (code: string) => void;
}

export function OrderSummary({
  subtotal,
  shipping,
  discount,
  onApplyDiscount,
}: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const total = subtotal + shipping - discount;

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      onApplyDiscount(discountCode);
      setIsApplied(true);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3">
          {discount > 0 && (
            <>
              <div className="flex justify-between text-sm text-gray-500 line-through mb-1">
                <span>Original Total</span>
                <span>${(subtotal + shipping).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Final Total</span>
                <span className="font-medium text-green-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </>
          )}
          {discount === 0 && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-medium text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-700 mb-2">
          Discount Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter code"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isApplied}
            />
          </div>
          <button
            onClick={handleApplyDiscount}
            disabled={!discountCode.trim() || isApplied}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {isApplied ? "Applied" : "Apply"}
          </button>
        </div>
        {isApplied && discount > 0 && (
          <p className="text-sm text-green-600 mt-2">
            Discount code applied successfully!
          </p>
        )}
        {isApplied && shipping === 0 && discount === 0 && (
          <p className="text-sm text-green-600 mt-2">Free shipping applied!</p>
        )}
      </div>

      <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
        Proceed to Checkout
      </button>
    </div>
  );
}
