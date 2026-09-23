import React, { useState, useEffect, useRef, useCallback } from 'react';
import { productsApi } from '../api/products';
import { useRouter } from '../context/RouterContext';
import { useMutations } from '../context/MutationContext';
import { FilterBar } from '../components/FilterBar';
import { ProductTable } from '../components/ProductTable';
import { ProductCardList } from '../components/ProductCardList';
import { Pagination } from '../components/Pagination';
import { ProductModal } from '../components/ProductModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/StatusStates';

export const ProductsPage = () => {
  const { searchParams, setSearchParams } = useRouter();
  const { mutations, addLocalProduct, updateLocalProduct, deleteLocalProduct } = useMutations();

  // 1. Defensively parse and sanitize URL parameters
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawLimit = parseInt(searchParams.get('limit') || '10', 10);
  const limit = [10, 20, 50].includes(rawLimit) ? rawLimit : 10;

  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || 'asc';
  const delay = parseInt(searchParams.get('delay') || '0', 10);

  // 2. Local state
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feedback notifications banner (e.g. "Product created locally")
  const [toast, setToast] = useState(null);

  // Modal states
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // 3. Race condition prevention ref: tracks latest request sequence ID
  const latestRequestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  // Helper to show auto-dismissing toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper to update search params in URL cleanly
  const updateUrlParams = useCallback(
    (updates, options = { replace: false }) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, val]) => {
          if (val === null || val === undefined || val === '') {
            next.delete(key);
          } else {
            next.set(key, String(val));
          }
        });
        return next;
      }, options);
    },
    [setSearchParams]
  );

  // Fetch categories once on mount
  useEffect(() => {
    let isMounted = true;
    productsApi
      .getCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load categories', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Main data fetching effect
  const fetchProducts = useCallback(async () => {
    // Abort any ongoing request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++latestRequestIdRef.current;
    setLoading(true);
    setError(null);

    const skip = (page - 1) * limit;

    try {
      const data = await productsApi.getProducts({
        limit,
        skip,
        search,
        category,
        sortBy,
        order,
        delay,
        signal: controller.signal,
      });

      // Guard against race conditions: if a newer request was dispatched, discard this result!
      if (currentRequestId !== latestRequestIdRef.current) {
        return;
      }

      let fetchedProducts = data.products || [];
      let calculatedTotal = data.total || 0;

      // Handle the API limitation: if both category AND search are specified,
      // DummyJSON queried the category endpoint, so we client-filter the query!
      if (search && category) {
        const qLower = search.toLowerCase();
        fetchedProducts = fetchedProducts.filter(
          (p) =>
            p.title?.toLowerCase().includes(qLower) ||
            p.description?.toLowerCase().includes(qLower) ||
            p.brand?.toLowerCase().includes(qLower)
        );
        calculatedTotal = fetchedProducts.length;
      }

      // Merge simulated mutations overlay:
      // Filter out locally deleted IDs
      const deletedSet = new Set(mutations.deleted);
      fetchedProducts = fetchedProducts.filter((p) => !deletedSet.has(String(p.id)));

      // Apply locally updated fields
      fetchedProducts = fetchedProducts.map((p) => {
        const localUpdates = mutations.updated[p.id];
        return localUpdates ? { ...p, ...localUpdates } : p;
      });

      // Prepend locally added products on page 1 (if matching current category / search)
      if (page === 1 && mutations.added.length > 0) {
        const matchingAdded = mutations.added.filter((p) => {
          if (deletedSet.has(String(p.id))) return false;
          if (category && p.category !== category) return false;
          if (search) {
            const q = search.toLowerCase();
            return (
              p.title?.toLowerCase().includes(q) ||
              p.brand?.toLowerCase().includes(q)
            );
          }
          return true;
        });

        // Ensure no duplicate IDs
        const existingIds = new Set(fetchedProducts.map((p) => String(p.id)));
        const newToAdd = matchingAdded.filter((p) => !existingIds.has(String(p.id)));
        fetchedProducts = [...newToAdd, ...fetchedProducts];
        calculatedTotal += newToAdd.length;
      }

      setProducts(fetchedProducts);
      setTotal(calculatedTotal);
    } catch (err) {
      // Ignore AbortError / CanceledError
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      if (currentRequestId === latestRequestIdRef.current) {
        setError(err.message || 'Failed to fetch products');
      }
    } finally {
      if (currentRequestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [page, limit, search, category, sortBy, order, delay, mutations]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // Handlers for Filters
  const handleSearchChange = (newQuery) => {
    updateUrlParams({
      q: newQuery,
      page: 1, // Rule: Always reset to page 1 on search change
    });
  };

  const handleCategoryChange = (newCat) => {
    updateUrlParams({
      category: newCat,
      page: 1, // Reset to page 1 on category change
    });
  };

  const handleSortChange = (newSortBy, newOrder) => {
    updateUrlParams({
      sortBy: newSortBy,
      order: newOrder,
    });
  };

  const handleDelayChange = (newDelay) => {
    updateUrlParams({
      delay: newDelay > 0 ? newDelay : null,
    });
  };

  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    updateUrlParams({
      limit: newSize,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    updateUrlParams({
      q: null,
      category: null,
      sortBy: null,
      order: null,
      page: 1,
    });
  };

  // Add / Edit Modal submissions
  const handleSaveProduct = async (productData) => {
    setModalSubmitting(true);
    try {
      if (modalState.data?.id) {
        // Edit existing product
        await productsApi.updateProduct(modalState.data.id, productData);
        updateLocalProduct(modalState.data.id, productData);
        showToast(`Product #${modalState.data.id} updated successfully!`);
      } else {
        // Add new product
        const response = await productsApi.addProduct(productData);
        const newProduct = {
          ...productData,
          id: response.id || Date.now(),
        };
        addLocalProduct(newProduct);
        showToast(`Product "${productData.title}" created successfully!`);
      }
      setModalState({ isOpen: false, data: null });
    } catch (err) {
      showToast(err.message || 'Action failed on server', 'error');
    } finally {
      setModalSubmitting(false);
    }
  };

  // Delete product submission
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await productsApi.deleteProduct(deleteTarget.id);
      deleteLocalProduct(deleteTarget.id);
      showToast(`Product #${deleteTarget.id} deleted successfully!`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast banner */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-md text-xs font-medium shadow-lg transition-all animate-in slide-in-from-bottom-2 ${
            toast.type === 'error'
              ? 'bg-[#ee0000] text-white'
              : 'bg-[#171717] text-white border border-neutral-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header section with Geist typography */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className=" text-[11px] font-medium tracking-wider text-[#8f8f8f] uppercase">
            CATALOG MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-[#171717] mt-0.5">
            Products
          </h1>
          <p className="text-xs text-[#8f8f8f] mt-1">
            Manage your store inventory, check real-time stock levels, and customize product listings.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <FilterBar
        search={search}
        category={category}
        categories={categories}
        sortBy={sortBy}
        order={order}
        delay={delay}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onDelayChange={handleDelayChange}
        onOpenAddModal={() => setModalState({ isOpen: true, data: null })}
        loading={loading}
      />

      {/* Main Content: Loading, Error, Empty, or Table */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <EmptyState
          message={
            search || category
              ? `No products found matching query "${search || category}".`
              : 'Your product catalog is currently empty.'
          }
          onReset={handleResetFilters}
        />
      ) : (
        <div className="space-y-4">
          <ProductTable
            products={products}
            onEdit={(p) => setModalState({ isOpen: true, data: p })}
            onDelete={(p) => setDeleteTarget(p)}
          />
          <ProductCardList
            products={products}
            onEdit={(p) => setModalState({ isOpen: true, data: p })}
            onDelete={(p) => setDeleteTarget(p)}
          />
          <Pagination
            currentPage={page}
            pageSize={limit}
            totalItems={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            disabled={loading}
          />
        </div>
      )}

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, data: null })}
        onSubmit={handleSaveProduct}
        initialData={modalState.data}
        categories={categories}
        loading={modalSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        productTitle={deleteTarget?.title}
        loading={deleteSubmitting}
      />
    </div>
  );
};

