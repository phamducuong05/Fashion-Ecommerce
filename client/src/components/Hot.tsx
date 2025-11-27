import { Button } from "./variants/button";
import ProductCard from "./ProductCard";
import type { ProductSummary } from "./ProductCard";
import { Tabs, TabsList, TabsTrigger } from "./Tab";
import { Link } from "lucide-react";

interface HotProp {
  whatsHotProducts: ProductSummary[];
  handleAddToCart: (product: ProductSummary) => void;
  whatsHotTab: string;
  setWhatsHotTab: (value: string) => void;
}

const Hot = ({
  whatsHotProducts,
  handleAddToCart,
  whatsHotTab,
  setWhatsHotTab,
}: HotProp) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl">WHAT'S HOT</h2>
        <div className="flex items-center gap-4">
          <Tabs value={whatsHotTab} onValueChange={setWhatsHotTab}>
            <TabsList>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
              <TabsTrigger value="bestseller">Best Sellers</TabsTrigger>
              <TabsTrigger value="sale">Sales</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {whatsHotProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default Hot;
