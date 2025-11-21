import Hero from "../components/Hero";
import Hot from "../components/Hot";
import Featured from "../components/Featured";
import Merit from "../components/Merit";
import type { Product } from "../components/ProductCard";
import Contact from "../components/Contact";
import type { FormData } from "../App";
import Footer from "../components/Footer";

interface HomeProp {
  cartItemCount: number;
  whatsHotProducts: Product[];
  handleAddToCart: (product: Product) => void;
  whatsHotTab: string;
  setWhatsHotTab: (value: string) => void;
  featuredTab: string;
  setFeaturedTab: (value: string) => void;
  featuredProducts: Product[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmitContact: (e: React.FormEvent) => void;
}

const HomePage = ({
  whatsHotProducts,
  handleAddToCart,
  whatsHotTab,
  setWhatsHotTab,
  featuredTab,
  setFeaturedTab,
  featuredProducts,
  formData,
  setFormData,
  handleSubmitContact,
}: HomeProp) => {
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
