import ProductList from "../components/ProductList";
import type { ProductSummary } from "../components/ProductCard";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";

interface ProductsPageProp {
  onAddToCart: (product: ProductSummary) => void;
}

export interface Category {
  id: number;
  name: string;
  image: string | null;
  parentId: number | null;
  children?: Category[];
}

const ProductsPage = ({ onAddToCart }: ProductsPageProp) => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("New Arrivals");
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch("http://localhost:3000/api/products"),
          fetch("http://localhost:3000/api/categories"),
        ]);

        const productsResponse = await resProd.json();
        const categoriesResponse = await resCat.json();

        const productsData = productsResponse.data as ProductSummary[];
        const categoriesData = categoriesResponse.data as Category[];
        setCategories(categoriesData);

        setProducts(productsData);
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
    filteredProducts = filteredProducts.filter((p) =>
      p.category.includes(filterCategory)
    );
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
            categories={categories}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
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
