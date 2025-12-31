import ProductList from "../components/ProductList";
import type { ProductSummary } from "../components/ProductCard";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { API_URL } from "../config";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [color, setColor] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Initial Data Fetch (Categories only needs to happen once)
  useEffect(() => {
      const fetchCategories = async () => {
          try {
              const res = await fetch(`${API_URL}/api/categories`);
              const data = await res.json();
              setCategories(data.data);
          } catch(err) {
              console.error(err);
          }
      }
      fetchCategories();
  }, []);

  // Fetch Products when filters change
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("keyword", debouncedSearch);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (color) params.append("color", color);
      if (sortBy) params.append("sort", sortBy);
      
      // Note: Category filtering could be done via backend too, currently we might want to do it via client 
      // OR update backend to support it. 
      // For now, let's assume we do CLIENT side category filtering since the user request prioritized backend search/filter
      // BUT for performance with 1000 items, backend category filter is better.
      // However, the backend product service I updated earlier didn't explicitly include 'cat' logic 
      // besides the interface comment. Let's keep Category Logic as Client-Side for now 
      // OR just rely on search? 
      // Actually, let's keep the existing client-side category filter for consistency unless I update backend again.
      // Wait, if I fetch ALL matches for 'shirt' then filter by category 'men', that's fine.
      // But pagination would be needed for true scalability.
      
      const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
      const response = await res.json();
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, sortBy, color]); // Price is manual apply, Category is client filter

  const handleApplyPriceFilter = () => {
      fetchProducts();
  };

  const clearAllFilters = () => {
    setSearch("");
    setSortBy("newest");
    setFilterCategory(null);
    setMinPrice("");
    setMaxPrice("");
    setColor("");
    // fetchProducts will trigger via effects or we call it manually if needed, 
    // but effects watch search/sort/color. Price needs manual trigger if only via button.
    // Resetting state effectively triggers effects for search/sort/color.
  };

  // Client-side category filtering (complementary to server-side search)
  // Ideally this should move to backend too.
  const displayedProducts = filterCategory
    ? products.filter((p) => p.category.includes(filterCategory))
    : products;

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
            placeholder="Search for products (name, description)..."
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
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            color={color}
            setColor={setColor}
            applyFilters={handleApplyPriceFilter}
          />
          <main className="flex-1">
             {loading ? (
                 <div className="text-center py-20">Loading products...</div>
             ) : (
                <ProductList
                  products={displayedProducts}
                  onAddToCart={onAddToCart}
                />
             )}
             {!loading && displayedProducts.length === 0 && (
                 <div className="text-center py-10 text-gray-500">No products found matching your criteria.</div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
