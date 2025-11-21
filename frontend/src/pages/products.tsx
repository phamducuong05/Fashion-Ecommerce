import ProductList from "../components/ProductList";
import type { Product } from "../components/ProductCard";
import { useState } from "react";
import SideBar from "../components/SideBar";

interface ProductsPageProp {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductsPage = ({ products, onAddToCart }: ProductsPageProp) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("New Arrivals");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSize, setFilterSize] = useState<string | null>(null);
  const [filterColor, setFilterColor] = useState<string | null>(null);

  const uniqueCategories = [...new Set(products.map((p) => p.category))];
  const uniqueColors = [...new Set(products.map((p) => p.color))] as string[];

  let filteredProducts = [...products];

  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filterCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === filterCategory
    );
  }

  if (filterColor) {
    filteredProducts = filteredProducts.filter((p) => p.color === filterColor);
  }

  switch (sortBy) {
    case "Price: Low to High":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "Price: High to Low":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }

  const clearAllFilters = () => {
    setSearch("");
    setSortBy("New Arrivals");
    setFilterCategory(null);
    setFilterColor(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-7">
          <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Bố cục chính: Sidebar + Product List */}
        <div className="flex flex-col md:flex-row">
          <SideBar
            categories={uniqueCategories}
            colors={uniqueColors}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterColor={filterColor}
            setFilterColor={setFilterColor}
            clearAllFilters={clearAllFilters}
          />
          <main className="flex-1">
            <ProductList
              products={filteredProducts}
              onAddToCart={onAddToCart}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
