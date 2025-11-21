import React from "react";

interface SidebarProps {
  categories: string[];
  colors: string[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  filterColor: string | null;
  setFilterColor: (color: string | null) => void;
  clearAllFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  colors,
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory,
  filterColor,
  setFilterColor,
  clearAllFilters,
}) => {
  return (
    <aside className="w-full md:w-64 lg:w-72 pr-8">
      <div className="space-y-6">
        {/* Clear Filters */}
        <div>
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Clear all filters
          </button>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>New Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Product Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() =>
                    setFilterCategory(
                      category === filterCategory ? null : category
                    )
                  }
                  className={`text-left w-full ${
                    filterCategory === category
                      ? "font-bold text-indigo-600"
                      : "text-gray-700"
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Colors */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Product Colors</h3>
          <ul className="space-y-2">
            {colors.map((color) => (
              <li key={color}>
                <button
                  onClick={() =>
                    setFilterColor(color === filterColor ? null : color)
                  }
                  className={`text-left w-full ${
                    filterColor === color
                      ? "font-bold text-indigo-600"
                      : "text-gray-700"
                  }`}
                >
                  {color}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
