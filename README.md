# Product Management Dashboard

A clean, modern product management web application built with **React**, **Vite**, and **Tailwind CSS**, powered by the [DummyJSON API](https://dummyjson.com).

---

## Live Demo

- **URL**: [https://assignment-product-dashboard.vercel.app](https://assignment-product-dashboard.vercel.app) *(or your deployed Vercel link)*

---

## Features

- **Authentication**: Secure login with simulated session tokens and demo credentials.
- **Product Catalog**:
  - Search products with debounced input.
  - Filter products by category.
  - Sort by price, rating, title, or stock.
  - Pagination with configurable page sizes (10, 20, 50 items).
- **CRUD Operations**:
  - Add new products.
  - Edit existing products.
  - Delete products with confirmation modals.
  - Local state persistence for updates and additions.
- **Product Details Page**:
  - Image gallery / thumbnails view.
  - Full specifications (pricing, discount, brand, SKU, dimensions, warranty, stock status).
  - Customer ratings and reviews.
- **Responsive UI**: Clean design inspired by the Geist design system, fully optimized for mobile, tablet, and desktop screens.
- **Deep Linking**: URL search params reflect filters, sorting, and pagination so pages can be bookmarked or shared.

---

## Demo Credentials

You can use the following default credentials to log in:

- **Username**: `emilys`
- **Password**: `emilyspass`

*(Quick-fill buttons are also available on the login page for testing.)*

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Getting Started Locally

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 2. Clone the repository
```bash
git clone https://github.com/arpitsharma418/product-dashboard.git
cd product-dashboard
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```