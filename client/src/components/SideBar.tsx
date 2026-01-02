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
    <aside className="w-full md:w-64 lg:w-72 pr-0 md:pr-6 mb-8 md:mb-0">
      {/* Container chính với style Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-8 sticky top-4">
        {/* Header & Clear Filter */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 tracking-wide">
            Filters
          </h2>
          <button
            onClick={clearAllFilters}
            className="text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all duration-200"
          >
            Reset All
          </button>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Sort By
          </h3>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none p-3 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-gray-100"
            >
              <option value="newest">New Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            {/* Custom Arrow Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* --- CATEGORIES --- */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((rootCat) => {
              const isExpanded = expandedCategories.includes(rootCat.name);

              return (
                <div key={rootCat.id} className="group">
                  {/* Level 1 Header */}
                  <button
                    onClick={() => toggleCategory(rootCat.name)}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {/* Ảnh Category với viền đẹp hơn */}
                      {rootCat.image && (
                        <div className="relative">
                          <img
                            src={rootCat.image}
                            alt={rootCat.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
                        {rootCat.name}
                      </span>
                    </div>

                    {/* Icon xoay mượt mà */}
                    <span
                      className={`text-gray-400 transform transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </span>
                  </button>

                  {/* Level 2 List */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-96 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="pl-4 space-y-1 border-l-2 border-gray-100 ml-6 my-1">
                      {rootCat.children?.map((subCat) => {
                        const isActive = filterCategory === subCat.name;
                        return (
                          <li key={subCat.id}>
                            <button
                              onClick={() =>
                                setFilterCategory(isActive ? null : subCat.name)
                              }
                              className={`w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200 flex items-center justify-between group/item ${
                                isActive
                                  ? "bg-indigo-50 text-indigo-700 font-bold shadow-sm"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              <span>{subCat.name}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
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
