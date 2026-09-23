import React from "react";
import { useRouter } from "../context/RouterContext";

export const ProductCardList = ({ products, onEdit, onDelete }) => {
  const { navigate } = useRouter();

  return (
    <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {products.map((product) => {
        const isOutOfStock = product.stock <= 0;
        const isLowStock = product.stock > 0 && product.stock <= 10;

        return (
          <div
            key={product.id}
            className="bg-white border border-[#ebebeb] rounded-xl p-3.5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <div>
              {/* Image & Main Info */}
              <div className="flex items-start gap-3 mb-2.5">
                <div
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="w-16 h-16 rounded-lg bg-[#f2f2f2] border border-[#ebebeb] overflow-hidden shrink-0 cursor-pointer flex items-center justify-center"
                >
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[10px] text-[#8f8f8f]">No img</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#fafafa] border border-[#ebebeb] text-[#4d4d4d] capitalize mb-1">
                    {product.category}
                  </span>
                  <h3
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="font-medium text-xs text-[#171717] line-clamp-2 hover:text-[#0070f3] cursor-pointer"
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-sm text-[#171717]">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <div className="inline-flex items-center gap-0.5 text-[11px]  text-[#171717]">
                      <span className="text-[#f5a623]">★</span>
                      <span>{Number(product.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges / Stock row */}
              <div className="flex items-center justify-between text-xs py-1.5 border-t border-[#ebebeb]/60">
                <span className="text-[11px] text-[#8f8f8f] ">
                  ID: #{product.id}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px]  font-medium ${
                    isOutOfStock
                      ? "bg-red-50 text-[#ee0000] border border-red-200"
                      : isLowStock
                        ? "bg-amber-50 text-[#ab570a] border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {isOutOfStock ? "0 (Out)" : `${product.stock} in stock`}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#ebebeb]">
              <button
                type="button"
                onClick={() => navigate(`/products/${product.id}`)}
                className="py-1.5 text-xs text-center border border-[#ebebeb] rounded-md bg-white text-[#4d4d4d] font-medium hover:border-[#171717]"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="py-1.5 text-xs text-center border border-[#ebebeb] rounded-md bg-white text-[#4d4d4d] font-medium hover:border-[#171717]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="py-1.5 text-xs text-center border border-red-200 rounded-md bg-white text-[#ee0000] font-medium hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
