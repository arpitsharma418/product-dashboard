import React, { useState, useEffect } from "react";
import { productsApi } from "../api/products";
import { useRouter } from "../context/RouterContext";
import { useMutations } from "../context/MutationContext";
import { ErrorState } from "../components/StatusStates";

export const ProductDetailPage = ({ productId }) => {
  const { navigate } = useRouter();
  const { mutations } = useMutations();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!productId || isNaN(Number(productId))) {
      setIsNotFound(true);
      setLoading(false);
      return;
    }

    if (mutations.deleted.includes(String(productId))) {
      setIsNotFound(true);
      setLoading(false);
      return;
    }

    const locallyAdded = mutations.added.find(
      (p) => String(p.id) === String(productId),
    );
    if (locallyAdded) {
      setProduct(locallyAdded);
      setSelectedImage(locallyAdded.thumbnail || "");
      setLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setIsNotFound(false);

    productsApi
      .getProductById(productId, controller.signal)
      .then((data) => {
        if (!isMounted) return;
        const localUpdates = mutations.updated[productId];
        const mergedProduct = localUpdates
          ? { ...data, ...localUpdates }
          : data;
        setProduct(mergedProduct);
        setSelectedImage(
          mergedProduct.images?.[0] || mergedProduct.thumbnail || "",
        );
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;

        if (err.status === 404 || err.message?.includes("not found")) {
          setIsNotFound(true);
        } else {
          setError(err.message || "Failed to load product details");
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productId, mutations]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
        <div className="h-4 bg-[#f2f2f2] rounded w-24 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-[#f2f2f2] rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-[#f2f2f2] rounded w-3/4" />
            <div className="h-4 bg-[#f2f2f2] rounded w-1/4" />
            <div className="h-24 bg-[#f2f2f2] rounded" />
            <div className="h-8 bg-[#f2f2f2] rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#fafafa] border border-[#ebebeb] mx-auto flex items-center justify-center text-[#8f8f8f] mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className=" text-xs uppercase tracking-wider text-[#8f8f8f]">
          ERROR 404
        </span>
        <h1 className="text-2xl font-semibold text-[#171717] mt-1 tracking-tight">
          Product Not Found
        </h1>
        <p className="text-xs text-[#8f8f8f] mt-2 leading-relaxed">
          The product ID{" "}
          <strong className="text-[#171717] ">#{productId}</strong>{" "}
          could not be found. It may have been removed or does not exist on
          DummyJSON.
        </p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#171717] text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-all shadow-sm"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Products</span>
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="text-xs font-medium text-[#171717] hover:underline"
          >
            ← Return to inventory catalog
          </button>
        </div>
      </div>
    );
  }

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.thumbnail].filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="inline-flex items-center gap-1.5 text-xs text-[#4d4d4d] hover:text-[#171717] mb-6 font-medium group transition-colors"
      >
        <svg
          className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
        <div className="space-y-3">
          <div className="aspect-square bg-white border border-[#ebebeb] rounded-[12px] overflow-hidden p-6 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-[8px] bg-white border p-1 shrink-0 overflow-hidden transition-all ${
                    selectedImage === img
                      ? "border-[#171717] ring-1 ring-[#171717]"
                      : "border-[#ebebeb] hover:border-[#8f8f8f]"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fafafa] border border-[#ebebeb] text-[#4d4d4d] capitalize">
                {product.category}
              </span>
              {product.brand && (
                <span className=" text-xs text-[#8f8f8f]">
                  Brand: {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-[#171717]">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="inline-flex items-center gap-1  font-medium text-[#171717]">
                <span className="text-[#f5a623]">★</span>
                <span>{Number(product.rating || 0).toFixed(1)}</span>
              </div>
              <span className="text-[#ebebeb]">•</span>
              <span className="text-[#8f8f8f] ">
                ID: #{product.id}
              </span>
              {product.sku && (
                <>
                  <span className="text-[#ebebeb]">•</span>
                  <span className="text-[#8f8f8f] ">
                    SKU: {product.sku}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="p-4 rounded-[12px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#8f8f8f]  uppercase">
                Price
              </div>
              <div className="text-2xl font-bold text-[#171717] ">
                ${Number(product.price).toFixed(2)}
              </div>
              {product.discountPercentage > 0 && (
                <div className="text-xs text-[#0070f3] ">
                  {product.discountPercentage}% OFF regular price
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[#8f8f8f]  uppercase">
                Inventory
              </div>
              <span
                className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs  font-medium ${
                  product.stock <= 0
                    ? "bg-red-50 text-[#ee0000] border border-red-200"
                    : product.stock <= 10
                      ? "bg-amber-50 text-[#ab570a] border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {product.stock <= 0
                  ? "Out of Stock"
                  : `${product.stock} Units in Stock`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xs  uppercase tracking-wider text-[#8f8f8f] mb-2">
              Description
            </h2>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              {product.description ||
                "No description provided for this product."}
            </p>
          </div>

          {/* Additional specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-[#ebebeb]">
            {product.warrantyInformation && (
              <div>
                <span className="text-[#8f8f8f] block">Warranty</span>
                <span className="font-medium text-[#171717]">
                  {product.warrantyInformation}
                </span>
              </div>
            )}
            {product.shippingInformation && (
              <div>
                <span className="text-[#8f8f8f] block">Shipping</span>
                <span className="font-medium text-[#171717]">
                  {product.shippingInformation}
                </span>
              </div>
            )}
            {product.returnPolicy && (
              <div>
                <span className="text-[#8f8f8f] block">Return Policy</span>
                <span className="font-medium text-[#171717]">
                  {product.returnPolicy}
                </span>
              </div>
            )}
            {product.availabilityStatus && (
              <div>
                <span className="text-[#8f8f8f] block">Availability</span>
                <span className="font-medium text-[#171717]">
                  {product.availabilityStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-[#ebebeb] pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className=" text-[11px] font-medium tracking-wider text-[#8f8f8f] uppercase">
              FEEDBACK
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-[#171717]">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review, i) => (
              <div
                key={i}
                className="bg-white border border-[#ebebeb] rounded-[12px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1  text-xs text-[#171717]">
                    <span className="text-[#f5a623]">★</span>
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                  <span className="text-[11px] text-[#8f8f8f] ">
                    {review.date
                      ? new Date(review.date).toLocaleDateString()
                      : "Recent"}
                  </span>
                </div>
                <p className="text-xs text-[#171717] italic mb-3">
                  "{review.comment}"
                </p>
                <div className="text-[11px] text-[#8f8f8f]  border-t border-[#ebebeb]/60 pt-2 flex items-center justify-between">
                  <span>{review.reviewerName}</span>
                  <span>{review.reviewerEmail}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8f8f8f]">
            No reviews recorded yet for this item.
          </p>
        )}
      </div>
    </div>
  );
};
