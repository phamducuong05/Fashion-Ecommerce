import Hero from "../components/Hero";
import Hot from "../components/Hot";
import Featured from "../components/Featured";
import Merit from "../components/Merit";
import type { ProductSummary } from "../components/ProductCard";
import { API_URL } from "../config";
import Contact from "../components/Contact";
import type { FormData } from "../App";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

interface HomeProp {
  cartItemCount: number;
  handleAddToCart: (product: ProductSummary) => void;
}

const HomePage = ({ cartItemCount, handleAddToCart }: HomeProp) => {
  const [products, setProduct] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [featuredTab, setFeaturedTab] = useState("t-shirt");
  const [whatsHotTab, setWhatsHotTab] = useState("new");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("⚡️ [HOME] Fetching products from API...");
        const res = await fetch("http://localhost:3000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const responseData = await res.json();
        const data = responseData.data as ProductSummary[];
        setProduct(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const whatsHotProducts = products.filter((p: ProductSummary) =>
    p.sections?.includes(whatsHotTab)
  );

  const featuredProducts = products.filter((item) =>
    item.category.includes(featuredTab)
  );

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Hot
        whatsHotProducts={whatsHotProducts}
        handleAddToCart={handleAddToCart}
        whatsHotTab={whatsHotTab}
        setWhatsHotTab={setWhatsHotTab}
      />

      <Featured
        featuredTab={featuredTab}
        setFeaturedTab={setFeaturedTab}
        featuredProducts={featuredProducts}
        handleAddToCart={handleAddToCart}
      />

      <Merit />
      <Contact
        handleSubmitContact={(e: React.FormEvent) => handleSubmitContact}
        formData={formData}
        setFormData={setFormData}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
