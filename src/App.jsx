import React from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "./context/RouterContext";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { path, navigate } = useRouter();

  // If user is not authenticated and not on login page, redirect to login
  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && path !== "/login") {
        navigate("/login", { replace: true });
      } else if (isAuthenticated && (path === "/login" || path === "/")) {
        navigate("/products", { replace: true });
      }
    }
  }, [isAuthenticated, loading, path, navigate]);

  // Route matching
  const renderCurrentPage = () => {
    if (!isAuthenticated) {
      return <LoginPage />;
    }

    // Match /products/:id
    const productDetailMatch = path.match(/^\/products\/(\d+|[^/]+)$/);
    if (productDetailMatch) {
      const productId = productDetailMatch[1];
      return <ProductDetailPage productId={productId} />;
    }

    // Default authenticated view is ProductsPage
    return <ProductsPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#171717]">
      <Navbar />
      <main className="flex-1">{renderCurrentPage()}</main>
      <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-6 px-4 text-center text-xs text-[#8f8f8f]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/favicon.svg"
              alt=""
              width={16}
              height={16}
              className="opacity-70"
            />
            <span className=" text-[11px]">
              DummyJSON Admin Dashboard • Built with React & Tailwind CSS
            </span>
          </div>
          <span className="text-[11px]">
            Strict adherence to Geist Design System
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
