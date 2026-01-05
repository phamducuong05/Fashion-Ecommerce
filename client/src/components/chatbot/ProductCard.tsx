import { Star, ShoppingBag } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  colors: string[] | string;
  sizes: string[] | string;
  slug?: string;
}

interface ProductCardProps {
  product: Product;
}

// Helper to convert color names to hex (basic mapping)
const getColorHex = (colorName: string): string => {
  // Handle non-string inputs
  if (!colorName || typeof colorName !== 'string') {
    return '#9CA3AF';
  }
  
  const colorMap: Record<string, string> = {
    white: '#FFFFFF',
    black: '#000000',
    red: '#EF4444',
    blue: '#3B82F6',
    'light blue': '#60A5FA',
    'dark blue': '#1E40AF',
    green: '#10B981',
    'olive green': '#84CC16',
    yellow: '#F59E0B',
    pink: '#EC4899',
    'pastel pink': '#FBCFE8',
    purple: '#A855F7',
    gray: '#6B7280',
    'light gray': '#D1D5DB',
    'dark gray': '#374151',
    brown: '#92400E',
    navy: '#1E3A8A',
    'navy blue': '#1E3A8A',
    beige: '#F5F5DC',
    orange: '#F97316',
    cream: '#FFFDD0',
    maroon: '#7C2D12',
  };
  return colorMap[colorName.toLowerCase().trim()] || '#9CA3AF';
};

export function ProductCard({ product }: ProductCardProps) {
  // Safely parse colors and sizes in case they come as comma-separated strings
  const colors = Array.isArray(product.colors) 
    ? product.colors 
    : typeof product.colors === 'string' 
      ? product.colors.split(',').map(c => c.trim()).filter(Boolean)
      : [];
      
  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === 'string'
      ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 group h-full flex flex-col w-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Product';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-2.5 flex-1 flex flex-col gap-1.5">
        {/* Product Name */}
        <h4 className="text-[11px] font-semibold text-gray-900 line-clamp-2 leading-tight h-8">
          {product.name}
        </h4>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-indigo-600">
            ${product.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-gray-600 font-medium">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Color & Size Info */}
        <div className="space-y-1">
          {/* Colors - Compact inline */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {colors.slice(0, 3).map((color: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                ))}
              </div>
              {colors.length > 3 && (
                <span className="text-[9px] text-gray-500">
                  +{colors.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Sizes - Compact inline */}
          {sizes && sizes.length > 0 && (
            <div className="flex gap-0.5 flex-wrap">
              {sizes.slice(0, 3).map((size: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[9px] px-1 py-0.5 bg-gray-100 text-gray-600 rounded"
                >
                  {size}
                </span>
              ))}
              {sizes.length > 3 && (
                <span className="text-[9px] text-gray-500 self-center">
                  +{sizes.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* View Button */}
        <button className="mt-auto w-full text-[10px] font-medium bg-indigo-600 text-white py-1.5 rounded-md hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1">
          <ShoppingBag className="w-2.5 h-2.5" />
          View Details
        </button>
      </div>
    </div>
  );
}
