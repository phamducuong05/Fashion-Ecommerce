import type { Product } from "./ProductCard";
import { Tabs, TabsList, TabsTrigger } from "./Tab";
import { Button } from "./variants/button";
import ProductCard from "./ProductCard";

interface FeatureProp {
  featuredTab: string;
  setFeaturedTab: (value: string) => void;
  featuredProducts: Product[];
  handleAddToCart: (product: Product) => void;
}

const Featured = ({
  featuredTab,
  setFeaturedTab,
  featuredProducts,
  handleAddToCart,
}: FeatureProp) => {
  return (
    <section className="container mx-auto px-4 py-16 border-t">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl">Featured Products</h2>
        <div className="flex items-center gap-4">
          <Tabs value={featuredTab} onValueChange={setFeaturedTab}>
            <TabsList>
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="kids">Kids</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">View All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product: Product) => (
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

export default Featured;
