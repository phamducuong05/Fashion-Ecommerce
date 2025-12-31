import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ImageWithFallback } from "./imagefallback";
import { ProductReviews } from "./ProductReviews";
import { useParams } from "react-router";
import type { ProductSummary } from "./ProductCard";
import { API_URL } from "../config";

interface ProductVariant {
  id: number;
  color: string;
  colorCode: string;
  size: string;
  stock: number;
  image: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  thumbnail: string;
  category: string[];
  variants: ProductVariant[];
}

interface ProductDetailProp {
  onAddToCart: (product: ProductSummary) => void;
}

const ProductDetail = ({ onAddToCart }: ProductDetailProp) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/products/${id}`);

        if (!res.ok) throw new Error("Product not found");

        const response = await res.json();
        const data = response.data as Product;
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        } 
        // Logic change: don't set global error here, just let it render with null selectedVariant
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    // Construct ProductSummary for cart
    const productToAdd: ProductSummary = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: selectedVariant.image || "", // Use variant image or empty
        category: product.category,
        color: selectedVariant.color,
        size: selectedVariant.size,
        // Optional fields
        // originalPrice: ... (if available in backend)
    };

    onAddToCart(productToAdd);
  };

  if (loading)
    return <div className="p-10 text-center">Loading product...</div>;

  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  if (!product)
    return <div className="p-10 text-center text-red-500">Product not found</div>;

  const uniqueColorVariants = product.variants ? [
    ...new Map(product.variants.map((item) => [item.color, item])).values(),
  ] : [];

  const availableSizes = selectedVariant ? product.variants.filter(
    (p) => p.color === selectedVariant.color
  ) : [];

  const handleColorSelect = (colorName: string) => {
    const variantOfColor = product.variants.find((v) => v.color === colorName);
    if (variantOfColor) setSelectedVariant(variantOfColor);
  };

  const handleSizeSelect = (sizeVariant: ProductVariant) => {
    setSelectedVariant(sizeVariant);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star - 0.5 <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={selectedVariant?.image || product.thumbnail || ""}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h1>{product.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  {renderStars(product.rating)}
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl text-gray-900">
                    ${product.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>

               {/* Color Selection - Hide if no variants */}
              {product.variants && product.variants.length > 0 && selectedVariant && (
              <div>
                <label>
                  Color: <span>{selectedVariant.color}</span>
                </label>
                <div className="flex gap-3">
                  {uniqueColorVariants.map((colorVar) => (
                    <button
                      key={colorVar.id}
                      onClick={() => handleColorSelect(colorVar.color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedVariant.color === colorVar.color
                          ? "border-blue-600 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: colorVar.colorCode }}
                      aria-label={selectedVariant.color}
                    />
                  ))}
                </div>
              </div>
              )}

              {/* Size Selection - Hide if no variants */}
              {product.variants && product.variants.length > 0 && selectedVariant && (
              <div>
                <label>
                  Size: <span>{selectedVariant.size}</span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((sizeVar) => (
                    <button
                      key={sizeVar.id}
                      onClick={() => handleSizeSelect(sizeVar)}
                      disabled={sizeVar.stock === 0}
                      className={`py-3 px-4 border rounded-lg transition-all ${
                        selectedVariant.id === sizeVar.id
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }
                                  ${
                                    sizeVar.stock === 0
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                    >
                      {sizeVar.size}
                    </button>
                  ))}
                </div>
              </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || (selectedVariant.stock === 0)}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedVariant ? (selectedVariant.stock === 0 ? "Out of Stock" : "Add to Cart") : "Unavailable"}
              </button>
            </div>
          </div>
        </div>
        <ProductReviews />
      </div>
    </div>
  );
};

export default ProductDetail;
