import ProductCard from "./ProductCard";
import type { ProductSummary } from "../components/ProductCard";

interface ProductListProp {
  products: ProductSummary[];
  onAddToCart: (product: ProductSummary) => void;
}

const ProductList = ({ products, onAddToCart }: ProductListProp) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
