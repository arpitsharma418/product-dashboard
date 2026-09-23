import React from "react";
import { useRouter } from "../context/RouterContext";

export const ProductTable = ({ products, onEdit, onDelete }) => {
  const { navigate } = useRouter();

  return (
    <div className="hidden md:block overflow-x-auto border border-[#ebebeb] rounded-[12px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#fafafa] border-b border-[#ebebeb] text-[#8f8f8f]  uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 px-4 w-14">Image</th>
            <th className="py-3 px-4">Title & Details</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4 text-right">Price</th>
            <th className="py-3 px-4 text-center">Rating</th>
            <th className="py-3 px-4 text-center">Stock</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ebebeb]">
          {products.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 10;

            return (
              <tr
                key={product.id}
                className="hover:bg-[#fafafa]/80 transition-colors group"
              >
                {/* Thumbnail Image */}
                <td className="py-3 px-4">
                  <div
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="w-10 h-10 rounded-md bg-[#f2f2f2] border border-[#ebebeb] overflow-hidden cursor-pointer flex items-center justify-center shrink-0 group-hover:border-[#171717]/40 transition-colors"
                  >
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] text-[#8f8f8f]">No img</span>
                    )}
                  </div>
                </td>

                {/* Title & Brand */}
                <td className="py-3 px-4 max-w-xs">
                  <div
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="font-medium text-[#171717] hover:text-[#0070f3] cursor-pointer transition-colors truncate"
                    title={product.title}
                  >
                    {product.title}
                  </div>
                  <div className="text-[11px] text-[#8f8f8f] truncate">
                    {product.brand ? `${product.brand} • ` : ""}ID: #
                    {product.id}
                  </div>
                </td>

                {/* Category Pill */}
                <td className="py-3 px-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#fafafa] border border-[#ebebeb] text-[#4d4d4d] capitalize">
                    {product.category}
                  </span>
                </td>

                {/* Price with optional discount */}
                <td className="py-3 px-4 text-right">
                  <span className="font-semibold text-sm text-[#171717] ">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <div className="text-[10px] text-[#0070f3] ">
                      -{product.discountPercentage}%
                    </div>
                  )}
                </td>

                {/* Rating */}
                <td className="py-3 px-4 text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fafafa] border border-[#ebebeb] text-[11px]  font-medium text-[#171717]">
                    <span className="text-[#f5a623]">★</span>
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>
                </td>

                {/* Stock indicator */}
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px]  font-medium ${
                      isOutOfStock
                        ? "bg-red-50 text-[#ee0000] border border-red-200"
                        : isLowStock
                          ? "bg-amber-50 text-[#ab570a] border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {isOutOfStock ? "0 (Out)" : `${product.stock} units`}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="px-2 py-1 text-xs border border-[#ebebeb] hover:border-[#171717] rounded-md bg-white text-[#4d4d4d] hover:text-[#171717] transition-all"
                      title="View details"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="px-2 py-1 text-xs border border-[#ebebeb] hover:border-[#171717] rounded-md bg-white text-[#4d4d4d] hover:text-[#171717] transition-all"
                      title="Edit product"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="px-2 py-1 text-xs border border-red-200 hover:border-[#ee0000] rounded-md bg-white text-[#ee0000] hover:bg-red-50 transition-all"
                      title="Delete product"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
