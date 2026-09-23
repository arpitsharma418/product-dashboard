import React, { useState, useEffect } from "react";

export const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  loading = false,
}) => {
  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    rating: "4.5",
    stock: "",
    category: "",
    brand: "",
    thumbnail: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price !== undefined ? String(initialData.price) : "",
        rating:
          initialData.rating !== undefined ? String(initialData.rating) : "4.5",
        stock: initialData.stock !== undefined ? String(initialData.stock) : "",
        category: initialData.category || categories[0]?.slug || "beauty",
        brand: initialData.brand || "",
        thumbnail: initialData.thumbnail || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        rating: "4.5",
        stock: "",
        category: categories[0]?.slug || "beauty",
        brand: "",
        thumbnail: "",
      });
    }
    setErrors({});
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "Product title is required";
    }
    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      errs.price = "Valid price greater than 0 is required";
    }
    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      Number(formData.stock) < 0
    ) {
      errs.stock = "Valid stock number (≥ 0) is required";
    }
    if (!formData.category) {
      errs.category = "Category is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating || 4.5),
      stock: parseInt(formData.stock, 10),
      thumbnail:
        formData.thumbnail.trim() ||
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.png",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#ebebeb] rounded-xl w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb]">
          <div>
            <span className=" text-[10px] uppercase tracking-wider text-[#8f8f8f]">
              {isEdit
                ? `EDIT PRODUCT #${initialData?.id}`
                : "NEW INVENTORY ENTRY"}
            </span>
            <h2 className="text-base font-semibold text-[#171717] tracking-tight">
              {isEdit ? "Update Product Details" : "Add New Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8f8f8f] hover:text-[#171717] p-1 rounded hover:bg-[#fafafa]"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#171717] mb-1">
              Title <span className="text-[#ee0000]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-[#171717] focus:outline-none ${
                errors.title
                  ? "border-[#ee0000]"
                  : "border-[#ebebeb] focus:border-[#171717]"
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-[#ee0000] mt-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1">
                Category <span className="text-[#ee0000]">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-2.5 py-2 text-xs bg-white border border-[#ebebeb] rounded-md text-[#171717] focus:outline-none focus:border-[#171717]"
              >
                {categories.map((c) => {
                  const slug = typeof c === "object" ? c.slug : c;
                  const name = typeof c === "object" ? c.name : c;
                  return (
                    <option key={slug} value={slug}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="e.g. Sony, Apple, Essence"
                className="w-full px-3 py-2 text-xs bg-white border border-[#ebebeb] rounded-md text-[#171717] focus:outline-none focus:border-[#171717]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1">
                Price ($) <span className="text-[#ee0000]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="29.99"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-[#171717] focus:outline-none ${
                  errors.price
                    ? "border-[#ee0000]"
                    : "border-[#ebebeb] focus:border-[#171717]"
                }`}
              />
              {errors.price && (
                <p className="text-[11px] text-[#ee0000] mt-1">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1">
                Stock Quantity <span className="text-[#ee0000]">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="45"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-[#171717] focus:outline-none ${
                  errors.stock
                    ? "border-[#ee0000]"
                    : "border-[#ebebeb] focus:border-[#171717]"
                }`}
              />
              {errors.stock && (
                <p className="text-[11px] text-[#ee0000] mt-1">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171717] mb-1">
              Thumbnail Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.value })
              }
              placeholder="https://images.example.com/item.jpg"
              className="w-full px-3 py-2 text-xs bg-white border border-[#ebebeb] rounded-md text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171717] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Short description of product features..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#ebebeb] rounded-md text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ebebeb]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 text-xs border border-[#ebebeb] rounded-md bg-white text-[#4d4d4d] hover:text-[#171717] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs bg-[#171717] text-white rounded-md font-medium hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading && (
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              <span>{isEdit ? "Save Changes" : "Create Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
