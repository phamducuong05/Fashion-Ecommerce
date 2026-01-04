import { Star } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Product Name */}
        <h4 className="text-sm line-clamp-2 text-gray-900 mb-2">
          {product.name}
        </h4>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount})
          </span>
        </div>

        {/* Color Variants */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-gray-500 mr-1">Colors:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Size Variants */}
        {product.sizes.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-gray-500">Sizes:</span>
            <span className="text-xs text-gray-700">
              {product.sizes.join(", ")}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-indigo-600">${product.price.toFixed(2)}</span>
          <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
