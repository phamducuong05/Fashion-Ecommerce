import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppError } from "../../../server/src/utils/AppError"; // Optional: if shared types exist, else ignore
import { Button } from "../components/variants/button"; // Adjust path if needed or use standard button
import { API_URL } from "../config";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for form
    const [recipientName, setRecipientName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signin");
                return;
            }

            const res = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentMethod,
                    addressData: { recipientName, phone, address }
                })
            });

            const data = await res.json();

            if (data.status === "success") {
                if (paymentMethod === "COD") {
                    // Navigate to Success
                    navigate(`/order-success?id=${data.data.order.id}`);
                } else if (paymentMethod === "VNPAY" && data.data.vnpUrl) {
                    // Redirect to VNPay
                    window.location.href = data.data.vnpUrl;
                }
            } else {
                setError(data.message || "Checkout failed");
            }

        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCheckout} className="space-y-6">
                    {/* Shipping Info */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
                                <input
                                    type="text"
                                    required
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address (City, District, Ward, Detail)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    id="cod"
                                    name="paymentMethod"
                                    type="radio"
                                    checked={paymentMethod === "COD"}
                                    onChange={() => setPaymentMethod("COD")}
                                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                                />
                                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                    Cash on Delivery (COD)
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="vnpay"
                                    name="paymentMethod"
                                    type="radio"
                                    checked={paymentMethod === "VNPAY"}
                                    onChange={() => setPaymentMethod("VNPAY")}
                                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                                />
                                <label htmlFor="vnpay" className="ml-3 block text-sm font-medium text-gray-700">
                                    VNPay (Online Payment)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                        >
                            {loading ? "Processing..." : "Place Order"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
