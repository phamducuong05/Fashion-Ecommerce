import { useSearchParams, useNavigate, Link } from "react-router";
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react";
import { Button } from "../components/variants/button";
import { useEffect, useState, useRef } from "react"; // 1. Import useRef

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying payment...");
  const [orderId, setOrderId] = useState<number | null>(null);

  const hasCalledAPI = useRef(false);

  useEffect(() => {
    // 3. Kiểm tra chốt chặn ngay đầu hàm
    if (hasCalledAPI.current) {
        return; // Nếu đã gọi rồi thì dừng lại ngay, không làm gì cả
    }
    
    // Đánh dấu là đã gọi
    hasCalledAPI.current = true;
    const verifyPayment = async () => {
      // 1. Lấy Token
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("failed");
        setMessage("Please login to continue.");
        return;
      }

      // 2. Lấy thông tin chờ (Address, Voucher) từ LocalStorage
      // Vì VNPAY không trả lại mấy cái này, ta phải tự lưu lúc bấm Checkout
      const pendingData = localStorage.getItem("pendingCheckout");
      let addressId = "";
      let voucherCode = "";

      if (pendingData) {
        const parsed = JSON.parse(pendingData);
        // Kiểm tra xem dữ liệu có quá cũ không (ví dụ quá 30 phút thì bỏ)
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
          addressId = parsed.addressId;
          voucherCode = parsed.voucherCode || "";
        }
      }

      // 3. Gom tham số URL VNPAY trả về
      const params = Object.fromEntries(searchParams.entries());

      // 4. Gọi API Backend (Endpoint chuyên biệt cho VNPAY)
      // KHÔNG gọi /api/orders, mà gọi /api/payment/vnpay_return
      try {
        const queryString = new URLSearchParams(params).toString();

        // Gửi kèm addressId và voucherCode để Backend tạo đơn
        const apiUrl = `/api/payment/vnpay_return?${queryString}&addressId=${addressId}&voucherCode=${voucherCode}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Backend cần biết User nào đang thanh toán
          },
        });

        const data = await response.json();

        if (data.code === "00") {
          // Backend xác nhận: Checksum đúng + Tiền đã về -> Backend đã tự tạo Order rồi
          setStatus("success");
          setMessage("Payment successful! Your order has been created.");
          setOrderId(data.orderId);

          // Dọn dẹp LocalStorage
          localStorage.removeItem("pendingCheckout");
          localStorage.removeItem("cart"); // Xóa giỏ hàng hiển thị
        } else {
          // Backend từ chối: Checksum sai hoặc Giao dịch lỗi
          setStatus("failed");
          setMessage(data.message || "Transaction failed or cancelled.");
          localStorage.removeItem("pendingCheckout");
        }
      } catch (error) {
        console.error("Payment verify error:", error);
        setStatus("failed");
        setMessage("Connection error to verification server.");
      }
    };

    // Chạy 1 lần khi trang load
    if (searchParams.get("vnp_ResponseCode")) {
      verifyPayment();
    }
  }, [searchParams]);

  const handleRedirect = () => {
    if (status === "success" && orderId) {
      navigate(`/orders/${orderId}`);
    } else {
      navigate("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* LOADING */}
        {status === "loading" && (
          <div>
            <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Processing...
            </h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              onClick={handleRedirect}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              View Order
            </Button>
          </div>
        )}

        {/* FAILED */}
        {status === "failed" && (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-2">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Home
                </Button>
              </Link>
              <Button
                onClick={handleRedirect}
                className="flex-1 bg-gray-900 text-white"
              >
                Back to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;
