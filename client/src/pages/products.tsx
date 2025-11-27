import ProductList from "../components/ProductList";
import type { ProductSummary } from "../components/ProductCard";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";

interface ProductsPageProp {
  onAddToCart: (product: ProductSummary) => void;
}

const ProductsPage = ({ onAddToCart }: ProductsPageProp) => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("New Arrivals");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterColor, setFilterColor] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi 3 API cùng lúc
        const [resProd, resCat, resCol] = await Promise.all([
          fetch("http://localhost:8000/products"),
          fetch("http://localhost:8000/categories"),
          fetch("http://localhost:8000/colors"),
        ]);

        const productsData = (await resProd.json()) as ProductSummary[];
        const categoriesData = await resCat.json();
        const colorsData = await resCol.json();

        const catNames = categoriesData.map((c: any) => c.id);

        const colNames = colorsData.map((c: any) => c.id);

        setProducts(productsData);
        setUniqueCategories([...new Set(catNames)] as string[]);
        setUniqueColors([...new Set(colNames)] as string[]);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    filteredProducts = filteredProducts.filter((p) => p.color == filterColor);
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
