import type { ProductSummary } from "./ProductCard";
import { Tabs, TabsList, TabsTrigger } from "./Tab";
import { Button } from "./variants/button";
import ProductCard from "./ProductCard";
import { Link } from "react-router";

interface FeatureProp {
  featuredTab: string;
  setFeaturedTab: (value: string) => void;
  featuredProducts: ProductSummary[];
  handleAddToCart: (product: ProductSummary) => void;
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
              <TabsTrigger value="t-shirt">T-Shirt</TabsTrigger>
              <TabsTrigger value="hoodie">Hoodie</TabsTrigger>
              <TabsTrigger value="pants">Pants</TabsTrigger>
              <TabsTrigger value="shorts">Shorts</TabsTrigger>
              <TabsTrigger value="jacket">Jacket</TabsTrigger>
              <TabsTrigger value="dress">Dress</TabsTrigger>
            </TabsList>
          </Tabs>
          <Link to="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product: ProductSummary) => (
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
