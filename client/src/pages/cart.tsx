import { OrderSummary } from "../components/OrderSummary";
import { ShoppingBag, ArrowLeft, Ticket, Loader2 } from "lucide-react";
// Đảm bảo CartItemType trong App.tsx đã được update có đủ các trường: stock, productId, variantId
import type { CartItemType } from "../App";
import { useState, useEffect } from "react";
import { CartItem } from "../components/CartItem"; // Import component mới của bạn
import { Link, useNavigate } from "react-router";
import { Button } from "../components/variants/button";

interface VoucherType {
  id: number;
  userVoucherId: number;
  code: string;
  description: string | null;
  value: string;
  type: string;
}

interface CartProp {
  cartItems: CartItemType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;
}

const CartPage = ({ cartItems, setCartItems }: CartProp) => {
  const navigate = useNavigate();

  // State UI
  const [shipping] = useState(15.0);
  const [discount, setDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [myVouchers, setMyVouchers] = useState<VoucherType[]>([]);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(
    null
  );

  // Helper lấy token
  const getToken = () => localStorage.getItem("token");

  // 1. Fetch Cart từ Backend
  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();

      // Nếu không có token -> Coi như giỏ hàng rỗng hoặc redirect login
      if (!token) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        // Lưu ý: Port 5000 (Backend)
        const [cartRes, voucherRes] = await Promise.all([
          fetch("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/vouchers/my-vouchers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (cartRes.status === 401 || voucherRes.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
          return;
        }

        const cartData = await cartRes.json();
        if (Array.isArray(cartData)) setCartItems(cartData);

        // Backend trả về mảng khớp với CartItemProps, set thẳng vào state
        if (voucherRes.ok) {
          const voucherData = await voucherRes.json();
          setMyVouchers(voucherData);
        }
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [setCartItems, navigate]);

  // 2. Xử lý thay đổi số lượng
  const handleQuantityChange = async (id: string, newQuantity: number) => {
    const token = getToken();
    if (!token) return;

    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    // Optimistic UI Update (Cập nhật giao diện trước khi gọi API cho mượt)
    const oldCart = [...cartItems];
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      // Nếu lỗi thì revert lại số cũ
      setCartItems(oldCart);
      alert("Không thể cập nhật số lượng (Có thể lỗi mạng hoặc hết hàng).");
    }
  };

  // 3. Xử lý xóa sản phẩm
  const handleRemoveItem = async (id: string) => {
    const token = getToken();
    if (!token) return;

    // Optimistic UI
    const oldCart = [...cartItems];
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      setCartItems(oldCart);
      alert("Không thể xóa sản phẩm.");
    }
  };

  const handleCheckout = async (
    addressId: number,
    paymentMethod: string,
    voucherCode: string | null
  ) => {
    const token = getToken();

    // Validate
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!token) {
      alert("Please sign in to checkout");
      navigate("/signin");
      return;
    }

    // Handle Online Payment - VNPay Integration
    if (paymentMethod === "ONLINE") {
      setIsCheckingOut(true);

      try {
        // Calculate final amount (subtotal + shipping - discount)

        // Call VNPay payment URL creation endpoint
        const response = await fetch("api/payment/create_payment_url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bankCode: "NCB", // Default bank code
            language: "vn", // Default language
            shippingAddressId: addressId,
            voucherCode: voucherCode,
          }),
        });

        if (!response.ok) {
          // Log ra xem lỗi gì để dễ debug
          const errData = await response.json();
          throw new Error(errData.message || "Failed to create payment URL");
        }

        const data = await response.json();

        // Check if payment URL is returned
        if (data.paymentUrl) {
          // Save checkout info to localStorage for later (when returning from VNPay)
          localStorage.setItem(
            "pendingCheckout",
            JSON.stringify({
              addressId: addressId,
              voucherCode: voucherCode,
              paymentMethod: "ONLINE",
              timestamp: Date.now(),
            })
          );

          // Open payment URL in new tab
          window.open(data.paymentUrl, "_blank");

          // Optional: Show message to user
          alert(
            "Payment page opened in new tab. Please complete your payment."
          );
        } else {
          throw new Error("No payment URL returned");
        }
      } catch (error: any) {
        console.error("VNPay payment error:", error);
        alert(`Failed to initiate payment: ${error.message}`);
      } finally {
        setIsCheckingOut(false);
      }

      return;
    }

    // Handle COD Payment
    if (paymentMethod === "COD") {
      setIsCheckingOut(true);

      try {
        const response = await fetch("api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddressId: addressId,
            paymentMethod: "COD",
            voucherCode: voucherCode,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Checkout failed");
        }

        const orderData = await response.json();
        const orderId = orderData.data?.id || orderData.id;

        // Success - Clear cart and redirect
        setCartItems([]);
        localStorage.removeItem("cart"); // Clear guest cart if any

        alert("Order placed successfully!");

        // Redirect to order detail page
        if (orderId) {
          navigate(`/orders/${orderId}`);
        } else {
          navigate("/profile"); // Fallback to profile/order history
        }
      } catch (error: any) {
        console.error("Checkout error:", error);
        alert(`Failed to place order: ${error.message}`);
      } finally {
        setIsCheckingOut(false);
      }
    }
  };

  // --- Logic hiển thị (Giữ nguyên code cũ của bạn) ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading Cart...
        </p>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const actualShipping = freeShipping ? 0 : shipping;

  // Coupon Logic (Tạm thời giữ ở Frontend)
  const handleApplyDiscount = (code: string) => {
    // Tìm voucher trong danh sách đã fetch từ API
    const voucher = myVouchers.find((v) => v.code === code);

    if (voucher) {
      const val = Number(voucher.value); // Chuyển string sang number

      if (voucher.type === "FREESHIP") {
        setFreeShipping(true);
        setDiscount(0);
      } else if (voucher.type === "PERCENT") {
        // Ví dụ: Giảm 10%
        const percentDiscount = (subtotal * val) / 100;
        setDiscount(percentDiscount);
        setFreeShipping(false);
      } else {
        // FIXED Amount
        setDiscount(val);
        setFreeShipping(false);
      }

      setSelectedVoucherCode(code); // Lưu lại code đang chọn để UI highlight
      alert(`Applied voucher: ${code}`);
    } else {
      alert("Invalid or expired voucher");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-gray-500 mt-1">Review your selected items</p>
          </div>
          <Link
            to="/products"
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Product</span>
                <span className="font-semibold text-gray-700 hidden sm:block">
                  {cartItems.length} Items
                </span>
              </div>

              <div className="p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/products">
                      <Button className="bg-black text-white hover:bg-gray-800 px-8">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        {/* CartItem Mới: 
                            - Tự động nhận các props: id, productId, variantId, stock... từ item 
                            - onQuantityChange và onRemove đã được sửa để gọi API
                        */}
                        <CartItem
                          {...item}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemoveItem}
                        />
                        {index !== cartItems.length - 1 && (
                          <div className="h-px bg-gray-100 my-6" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <OrderSummary
                subtotal={subtotal}
                shipping={actualShipping}
                discount={discount}
                onApplyDiscount={handleApplyDiscount}
                onCheckout={(addressId, paymentMethod) =>
                  handleCheckout(addressId, paymentMethod, selectedVoucherCode)
                }
                isProcessing={isCheckingOut}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Ticket className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900">Your Vouchers</h3>
              </div>

              {myVouchers.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {myVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      onClick={() => handleApplyDiscount(voucher.code)}
                      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between border border-dashed p-3 rounded-lg transition-all cursor-pointer ${
                        selectedVoucherCode === voucher.code
                          ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500"
                          : "bg-gray-50/50 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-indigo-700 font-mono tracking-wide">
                          {voucher.code}
                        </span>
                        <span className="text-xs text-gray-600">
                          {voucher.description ||
                            (voucher.type === "FREESHIP"
                              ? "Free Shipping"
                              : `Discount $${Number(voucher.value).toFixed(
                                  2
                                )}`)}
                        </span>
                      </div>

                      <div className="mt-2 sm:mt-0">
                        {selectedVoucherCode === voucher.code ? (
                          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                            Applied ✓
                          </span>
                        ) : (
                          <button className="text-xs font-bold bg-white text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  <p>No vouchers available.</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4 text-gray-400 grayscale opacity-70">
              <p className="text-xs text-center">
                Secure Checkout • 30-Day Returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
