import { OrderSummary } from "../components/OrderSummary";
import { ShoppingBag } from "lucide-react";
import type { CartItemType } from "../App";
import { useState } from "react";
import { CartItem } from "../components/CartItem";

interface CartProp {
  cartItems: CartItemType[];
  setCartItems: (cartitem: CartItemType[]) => void;
}

const CartPage = ({ cartItems, setCartItems }: CartProp) => {
  const [shipping] = useState(15.0);
  const [discount, setDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id != id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const actualShipping = freeShipping ? 0 : shipping;

  const possessedCodes = [
    { code: "SAVE10", description: "$10 off your order" },
    { code: "FASHION15", description: "$15 off your order" },
    { code: "FREESHIP", description: "Free shipping" },
  ];

  const handleApplyDiscount = (code: string) => {
    // Simple discount code logic - you can customize this
    const discountCodes: {
      [key: string]: { type: "amount" | "freeship"; value: number };
    } = {
      SAVE10: { type: "amount", value: 10 },
      SAVE20: { type: "amount", value: 20 },
      FASHION15: { type: "amount", value: 15 },
      FREESHIP: { type: "freeship", value: 0 },
    };

    const discountData = discountCodes[code.toUpperCase()];
    if (discountData) {
      if (discountData.type === "freeship") {
        setFreeShipping(true);
        setDiscount(0);
      } else {
        setDiscount(discountData.value);
        setFreeShipping(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-gray-900" />
          <h1 className="text-gray-900">Shopping Cart</h1>
          <span className="text-gray-500">({cartItems.length} items)</span>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              shipping={actualShipping}
              discount={discount}
              onApplyDiscount={handleApplyDiscount}
            />

            {/* Discount Codes Helper */}
            <div className="mt-4 p-4 bg-gray-900 rounded-lg text-sm">
              <p className="text-white font-medium mb-3">Codes Possessed</p>
              <div className="space-y-2">
                {possessedCodes.map((code) => (
                  <div
                    key={code.code}
                    className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                  >
                    <span className="text-white font-mono">{code.code}</span>
                    <span className="text-gray-400">{code.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
