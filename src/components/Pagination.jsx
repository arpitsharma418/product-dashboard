import React from "react";

export const Pagination = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, safeCurrentPage - 2);
      let end = Math.min(totalPages, safeCurrentPage + 2);

      if (safeCurrentPage <= 3) {
        start = 1;
        end = maxButtons;
      } else if (safeCurrentPage >= totalPages - 2) {
        start = totalPages - maxButtons + 1;
        end = totalPages;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 sm:px-4 border-t border-[#ebebeb] text-xs text-[#4d4d4d]">
      {/* Left: Summary and Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className=" text-[#8f8f8f]">
          Showing{" "}
          <strong className="text-[#171717] font-medium">
            {startItem}–{endItem}
          </strong>{" "}
          of{" "}
          <strong className="text-[#171717] font-medium">{totalItems}</strong>
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-[#8f8f8f]">Per page:</span>
          <select
            value={pageSize}
            disabled={disabled}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-[#ebebeb] rounded-md text-xs font-medium text-[#171717] px-2 py-1 focus:outline-none focus:border-[#171717] disabled:opacity-50 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Right: Controls & Page Numbers */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={disabled || safeCurrentPage <= 1}
          className="px-2.5 py-1 text-xs border border-[#ebebeb] rounded-md bg-white text-[#171717] hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium active:scale-95"
          aria-label="Previous Page"
        >
          Previous
        </button>

        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return (
                <span key={`dots-${idx}`} className="px-1 text-[#8f8f8f]">
                  ...
                </span>
              );
            }
            const isActive = page === safeCurrentPage;
            return (
              <button
                key={page}
                type="button"
                disabled={disabled}
                onClick={() => onPageChange(page)}
                className={`min-w-7 h-7 px-1.5 rounded-md text-xs  transition-all ${
                  isActive
                    ? "bg-[#171717] text-white font-medium shadow-sm"
                    : "text-[#4d4d4d] hover:bg-[#ebebeb]/60 hover:text-[#171717]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={disabled || safeCurrentPage >= totalPages}
          className="px-2.5 py-1 text-xs border border-[#ebebeb] rounded-md bg-white text-[#171717] hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium active:scale-95"
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
};
