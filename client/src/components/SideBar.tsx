import React, { useState } from "react";
import type { Category } from "../pages/products";

interface SidebarProps {
  categories: Category[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  clearAllFilters: () => void;
  // New props
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
  applyFilters: () => void;
}

const colors = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF", border: true },
  { name: "Blue", code: "#0000FF" },
  { name: "Red", code: "#FF0000" },
  { name: "Green", code: "#008000" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Gray", code: "#808080" },
  { name: "Pink", code: "#FFC0CB" },
];

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory,
  clearAllFilters,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  color,
  setColor,
  applyFilters,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((c) => c.name)
  );

  const toggleCategory = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(
        expandedCategories.filter((c) => c !== categoryName)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 pr-0 md:pr-8 mb-8 md:mb-0">
      <div className="space-y-8">
        {/* Header & Clear Filter */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 underline transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Sort By */}
        <div>
           <h3 className="text-md font-semibold text-gray-900 mb-3">Sort By</h3>
           <select
             value={sortBy}
             onChange={(e) => setSortBy(e.target.value)}
             className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
           >
             <option value="newest">New Arrivals</option>
             <option value="price_asc">Price: Low to High</option>
             <option value="price_desc">Price: High to Low</option>
             <option value="best_selling">Best Selling</option>
           </select>
         </div>

        <hr className="border-gray-200" />

        {/* Price Filter */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <button
            onClick={applyFilters}
            className="w-full py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Apply Price Filter
          </button>
        </div>

        <hr className="border-gray-200" />

        {/* Color Filter */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(color === c.name ? "" : c.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === c.name ? "ring-2 ring-indigo-500 ring-offset-2 border-transparent" : "border-transparent"
                } ${c.border ? "border-gray-200" : ""}`}
                style={{ backgroundColor: c.code }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- CATEGORIES (2 LEVELS + IMAGE) --- */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-4">
            Categories
          </h3>
          <div className="space-y-4">
            {categories.map((rootCat) => {
              const isExpanded = expandedCategories.includes(rootCat.name);

              return (
                <div
                  key={rootCat.id}
                  className="border-b border-gray-100 pb-2 last:border-0"
                >
                  {/* Level 1 Header (Có ảnh + Click để mở/đóng) */}
                  <button
                    onClick={() => toggleCategory(rootCat.name)}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-800 hover:text-indigo-600 mb-2 group"
                  >
                    <div className="flex items-center gap-3">
                      {rootCat.image && (
                        <img
                          src={rootCat.image}
                          alt={rootCat.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:border-indigo-200 transition-colors"
                        />
                      )}
                      <span className="text-base">{rootCat.name}</span>
                    </div>

                    {/* Icon + / - */}
                    <span className="text-gray-400 text-lg">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {/* Level 2 List (Chỉ hiện khi Expanded) */}
                  {isExpanded && rootCat.children && (
                    <ul className="pl-11 space-y-1">
                      {rootCat.children.map((subCat) => (
                        <li key={subCat.id}>
                          <button
                            onClick={() =>
                              setFilterCategory(
                                filterCategory === subCat.name
                                  ? null
                                  : subCat.name
                              )
                            }
                            className={`w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors ${
                              filterCategory === subCat.name
                                ? "bg-indigo-50 text-indigo-700 font-semibold"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {subCat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
