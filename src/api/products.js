import api from './axios';

export const productsApi = {
  getProducts: async ({
    limit = 10,
    skip = 0,
    search = '',
    category = '',
    sortBy = '',
    order = 'asc',
    delay = 0,
    signal,
  } = {}) => {
    let endpoint = '/products';
    const params = {
      limit,
      skip,
    };

    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }

    if (delay && Number(delay) > 0) {
      params.delay = Number(delay);
    }

    if (search && search.trim()) {
      endpoint = '/products/search';
      params.q = search.trim();
    } else if (category && category !== 'all') {
      endpoint = `/products/category/${encodeURIComponent(category)}`;
    }

    const response = await api.get(endpoint, {
      params,
      signal,
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  getProductById: async (id, signal) => {
    const response = await api.get(`/products/${id}`, { signal });
    return response.data;
  },

  addProduct: async (productData) => {
    const response = await api.post('/products/add', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

