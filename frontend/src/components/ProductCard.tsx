import { Button } from "./variants/button";
import { ImageWithFallback } from "./imagefallback";
import { Badge } from "./variants/Badge";
import { Heart, ShoppingBag } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  section?: string;
  gender?: string;
  color: string;
  size: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <Badge className="bg-black text-white font-semibold px-2 py-1 rounded-md">
              New
            </Badge>
          )}
          {product.isSale && discount > 0 && (
            <Badge className="bg-red-600 text-white font-semibold px-2 py-1 rounded-md">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white rounded-full shadow-sm"
        >
          <Heart className="h-5 w-5" fill="currentColor" />
        </Button>

        {/* Quick add button */}
        <Button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <p className="font-bold text-xl text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
