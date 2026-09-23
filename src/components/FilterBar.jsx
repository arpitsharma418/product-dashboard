import React, { useState, useEffect } from "react";

export const FilterBar = ({
  search,
  category,
  categories,
  sortBy,
  order,
  delay,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onDelayChange,
  onOpenAddModal,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, search, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <div className="bg-white border border-[#ebebeb] rounded-[12px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products by title, brand, or tag..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#ebebeb] rounded-md text-[#171717] placeholder-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-all"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8f8f8f] hover:text-[#171717]"
              title="Clear search"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#171717] hover:bg-neutral-800 text-white rounded-md text-xs font-medium tracking-tight transition-all active:scale-95 shadow-[0_1px_1px_rgba(0,0,0,0.04)] shrink-0"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Product</span>
        </button>
      </div>

      {/* Second row: Category, Sorting, and simulated delay toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ebebeb]/60 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#8f8f8f]">Category:</span>
            <select
              value={category || "all"}
              onChange={(e) =>
                onCategoryChange(e.target.value === "all" ? "" : e.target.value)
              }
              className="bg-white border border-[#ebebeb] rounded-md px-2.5 py-1 text-xs text-[#171717] font-medium focus:outline-none focus:border-[#171717] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => {
                const slug = typeof cat === "object" ? cat.slug : cat;
                const name = typeof cat === "object" ? cat.name : cat;
                return (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort By Field */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#8f8f8f]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value, order)}
              className="bg-white border border-[#ebebeb] rounded-md px-2.5 py-1 text-xs text-[#171717] font-medium focus:outline-none focus:border-[#171717] cursor-pointer"
            >
              <option value="">Default Order</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Sort Order Direction Toggle */}
          {sortBy && (
            <button
              type="button"
              onClick={() =>
                onSortChange(sortBy, order === "asc" ? "desc" : "asc")
              }
              className="flex items-center gap-1 px-2 py-1 bg-[#fafafa] border border-[#ebebeb] hover:border-[#171717] rounded-md text-xs  text-[#171717] transition-all"
              title={`Switch to ${order === "asc" ? "Descending" : "Ascending"}`}
            >
              <span>{order === "asc" ? "↑ ASC" : "↓ DESC"}</span>
            </button>
          )}
        </div>

        {/* Artificial Delay Toggle to test race conditions */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-[#4d4d4d] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={delay > 0}
              onChange={(e) => onDelayChange(e.target.checked ? 2000 : 0)}
              className="rounded text-[#171717] focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className=" text-[11px] text-[#8f8f8f]">
              Simulate 2s Delay (&delay=2000)
            </span>
          </label>
        </div>
      </div>

      {/* Note about API limitation when both search and category are active */}
      {search && category && (
        <div className="mt-3 p-2 rounded-md bg-amber-50/70 border border-amber-200/60 text-[11px] text-[#ab570a] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>Note:</strong> DummyJSON API cannot search and filter
              category in a single endpoint. We query category{" "}
              <em>"{category}"</em> and client-match query <em>"{search}"</em>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className="text-[10px] underline hover:text-[#171717]"
          >
            Clear category
          </button>
        </div>
      )}
    </div>
  );
};
