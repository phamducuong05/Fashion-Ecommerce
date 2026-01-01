import { Button } from "./variants/button";
import { ImageWithFallback } from "./imagefallback";
import { Badge } from "./variants/Badge";
import { ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string[];
  sections?: string[];
  color: string;
  size: string;
}

interface ProductCardProps {
  product: ProductSummary;
}

const ProductCard = ({ product}: ProductCardProps) => {
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
          {product.sections?.includes("new") && (
            <Badge className="bg-black text-white font-semibold px-2 py-1 rounded-md">
              New
            </Badge>
          )}
          {product.sections?.includes("sale") && discount > 0 && (
            <Badge className="bg-red-600 text-white font-semibold px-2 py-1 rounded-md">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          <Link to={`/productdetail/${product.id}`} className="w-full">
            <Button className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">
              <Eye className="h-4 w-4 mr-2" />
              View Detail
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <Link to="/productdetail">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3">
          <p className="font-bold text-xl text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
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
