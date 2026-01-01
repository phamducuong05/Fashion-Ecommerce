import Hero from "../components/Hero";
import Hot from "../components/Hot";
import Featured from "../components/Featured";
import Merit from "../components/Merit";
import type { ProductSummary } from "../components/ProductCard";
import Contact from "../components/Contact";
import type { FormData } from "../App";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/variants/button";

interface HomeProp {
  cartItemCount: number;
}

const HomePage = ({ cartItemCount }: HomeProp) => {
  const [products, setProduct] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [featuredTab, setFeaturedTab] = useState("Men Polos");
  const [whatsHotTab, setWhatsHotTab] = useState("new");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/products?limit=18");
      if (!res.ok)
        throw new Error("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
      const data = await res.json();
      const productRes = data.data as ProductSummary[];
      setProduct(productRes);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const whatsHotProducts = products
    .filter((p: ProductSummary) => (p.sections || []).includes(whatsHotTab))
    .slice(0, 3);

  const featuredProducts = products
    .filter((item) =>
      (item.category || []).some((cat) => cat.includes(featuredTab))
    )
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading fashion expreriences...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-red-50 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rất tiếc, đã có lỗi xảy ra!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <Button
          onClick={fetchProducts}
          variant="default"
          className="bg-red-600 hover:bg-red-700"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <Hero />

      <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white relative z-10 shadow-sm">
        <Hot
          whatsHotProducts={whatsHotProducts}
          whatsHotTab={whatsHotTab}
          setWhatsHotTab={setWhatsHotTab}
        />
      </section>

      <section className="pt-8 pb-16 md:pt-10 bg-gray-50/50 border-t border-b border-gray-90">
        <Featured
          featuredTab={featuredTab}
          setFeaturedTab={setFeaturedTab}
          featuredProducts={featuredProducts}
        />
      </section>

      <Merit />

      <section className="bg-white relative z-10">
        <Contact
          handleSubmitContact={handleSubmitContact}
          formData={formData}
          setFormData={setFormData}
        />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
