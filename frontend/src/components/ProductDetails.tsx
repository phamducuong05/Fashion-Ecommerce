import { useState } from "react";
import { Star } from "lucide-react";
import { ImageWithFallback } from "./imagefallback";
import { ProductReviews } from "./ProductReviews";

interface ProductVariant {
  id: string;
  colorName: string;
  colorCode: string;
  size: string;
  imageUrl: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  variants: ProductVariant[];
}

const ProductDetail = () => {
  const mockProduct: Product = {
    id: "1",
    name: "Premium Running Sneakers",
    price: 129.99,
    rating: 4.5,
    reviewCount: 328,
    description:
      "Experience ultimate comfort and style with our Premium Running Sneakers. Engineered for performance and designed for everyday wear.",
    variants: [
      {
        id: "v1",
        colorName: "Black",
        colorCode: "#000000",
        size: "9",
        imageUrl:
          "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbmVha2VyJTIwc2hvZXxlbnwxfHx8fDE3NjM3NDE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        stock: 10,
      },
      {
        id: "v2",
        colorName: "Black",
        colorCode: "#000000",
        size: "10",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ab?w=500",
        stock: 5,
      },
      {
        id: "v3",
        colorName: "White",
        colorCode: "#FFFFFF",
        size: "9",
        imageUrl:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
        stock: 12,
      },
      {
        id: "v4",
        colorName: "White",
        colorCode: "#FFFFFF",
        size: "11",
        imageUrl:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
        stock: 0,
      },
      {
        id: "v5",
        colorName: "Red",
        colorCode: "#DC2626",
        size: "10",
        imageUrl:
          "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500",
        stock: 20,
      },
    ],
  };
  const [selectedVariant, setSelectedVariant] = useState(
    mockProduct.variants[0]
  );

  const uniqueColorVariants = [
    ...new Map(
      mockProduct.variants.map((item) => [item.colorName, item])
    ).values(),
  ];

  const availableSizes = mockProduct.variants.filter(
    (p) => p.colorName === selectedVariant.colorName && p.stock > 0
  );

  const handleColorSelect = (colorName: string) => {
    const firstAvailableSize = mockProduct.variants.find(
      (v) => v.colorName === colorName
    );
    if (firstAvailableSize) setSelectedVariant(firstAvailableSize);
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
                src={selectedVariant.imageUrl}
                alt={mockProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h1>{mockProduct.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  {renderStars(mockProduct.rating)}
                  <span className="text-gray-600">
                    {mockProduct.rating} ({mockProduct.reviewCount} reviews)
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl text-gray-900">
                    ${mockProduct.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{mockProduct.description}</p>
              </div>

              {/* Color Selection */}
              <div>
                <label>
                  Color: <span>{selectedVariant.colorName}</span>
                </label>
                <div className="flex gap-3">
                  {uniqueColorVariants.map((colorVar) => (
                    <button
                      key={colorVar.id}
                      onClick={() => handleColorSelect(colorVar.colorName)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedVariant.colorName === colorVar.colorName
                          ? "border-blue-600 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: colorVar.colorCode }}
                      aria-label={selectedVariant.colorName}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
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

              <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-4">
                Add to Cart
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
