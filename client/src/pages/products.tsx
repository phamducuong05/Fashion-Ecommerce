import ProductList from "../components/ProductList";
import type { ProductSummary } from "../components/ProductCard";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("New Arrivals");
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterCategory, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `http://localhost:3000/api/products?page=${currentPage}&limit=1`;

        if (debouncedSearch) url += `&search=${debouncedSearch}`;
        if (filterCategory) url += `&category=${filterCategory}`;
        if (sortBy) url += `&sort=${sortBy}`;

        const res = await fetch(url);
        const json = await res.json();

        setProducts(json.data as ProductSummary[]);

        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearch, filterCategory, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <ProductList products={products} onAddToCart={onAddToCart} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
