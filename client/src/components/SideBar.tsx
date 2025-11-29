import React, { useState } from "react";
import type { Category } from "../pages/products";

interface SidebarProps {
  categories: Category[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  clearAllFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory,
  clearAllFilters,
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
            <option>New Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
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
