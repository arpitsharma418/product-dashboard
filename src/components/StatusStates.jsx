import React from "react";

export const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {/* Desktop table skeleton */}
      <div className="hidden md:block border border-[#ebebeb] rounded-xl bg-white p-4">
        <div className="h-6 bg-[#f2f2f2] rounded-sm w-full mb-4 animate-pulse" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-3 border-b border-[#ebebeb] last:border-none animate-pulse"
          >
            <div className="w-10 h-10 bg-[#f2f2f2] rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#f2f2f2] rounded w-1/3" />
              <div className="h-3 bg-[#f2f2f2] rounded w-1/4" />
            </div>
            <div className="w-20 h-5 bg-[#f2f2f2] rounded-full" />
            <div className="w-16 h-4 bg-[#f2f2f2] rounded" />
            <div className="w-12 h-4 bg-[#f2f2f2] rounded" />
            <div className="w-16 h-4 bg-[#f2f2f2] rounded-full" />
            <div className="w-24 h-6 bg-[#f2f2f2] rounded" />
          </div>
        ))}
      </div>

      {/* Mobile cards skeleton */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#ebebeb] rounded-xl p-4 animate-pulse space-y-3"
          >
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-[#f2f2f2] rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[#f2f2f2] rounded w-1/3" />
                <div className="h-4 bg-[#f2f2f2] rounded w-3/4" />
                <div className="h-4 bg-[#f2f2f2] rounded w-1/2" />
              </div>
            </div>
            <div className="h-6 bg-[#f2f2f2] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const EmptyState = ({
  message = "No products found matching your criteria.",
  onReset,
}) => {
  return (
    <div className="border border-[#ebebeb] rounded-xl bg-white p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] my-4">
      <div className="w-12 h-12 rounded-full bg-[#fafafa] border border-[#ebebeb] mx-auto flex items-center justify-center text-[#8f8f8f] mb-3">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-[#171717]">
        No Products Available
      </h3>
      <p className="text-xs text-[#8f8f8f] mt-1 max-w-sm mx-auto">{message}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 px-3 py-1.5 text-xs bg-white border border-[#ebebeb] hover:border-[#171717] rounded-md text-[#171717] font-medium transition-all"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({
  message = "Failed to load products.",
  onRetry,
}) => {
  return (
    <div className="border border-red-200 rounded-xl bg-red-50/50 p-8 text-center my-4">
      <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 mx-auto flex items-center justify-center text-[#ee0000] mb-3">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-[#171717]">
        Unable to load data
      </h3>
      <p className="text-xs text-[#4d4d4d] mt-1 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-[#171717] hover:bg-neutral-800 text-white rounded-md font-medium transition-all shadow-sm active:scale-95"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
