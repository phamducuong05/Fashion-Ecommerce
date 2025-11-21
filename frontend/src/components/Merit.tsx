import { Package, ShieldCheck, RotateCcw } from "lucide-react";

const Merit = () => {
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="mb-2">Fast Shipping</h3>
            <p className="text-sm text-gray-600">
              Free delivery on orders over $100
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h3 className="mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-600">
              30-day hassle-free return policy
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-600">
              100% secure and encrypted transactions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Merit;
