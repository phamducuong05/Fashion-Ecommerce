import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { CheckCircle } from "lucide-react";
import { Button } from "../components/variants/button";

const OrderSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Thank You!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                    Your order has been placed successfully.
                </p>

                {orderId && (
                    <div className="bg-gray-100 rounded-md p-4 mb-8">
                         <p className="text-sm text-gray-600">Order ID:</p>
                         <p className="text-xl font-bold text-gray-900">#{orderId}</p>
                    </div>
                )}

                <p className="text-sm text-gray-500 mb-8">
                    We have sent a confirmation email to your registered address.
                </p>

                <div className="space-y-4">
                    <Link to="/products">
                        <Button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800">
                            Continue Shopping
                        </Button>
                    </Link>
                    <Link to="/">
                         <p className="text-sm text-blue-600 hover:text-blue-500">
                             Return to Home
                         </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
