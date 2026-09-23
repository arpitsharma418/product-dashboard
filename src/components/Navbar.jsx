import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "../context/RouterContext";

import { Logo } from "./Logo";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { navigate, path } = useRouter();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-[#ebebeb] bg-[#fafafa]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate("/products")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <Logo
              size={24}
              className="transition-transform group-hover:scale-105"
            />
            <span className="font-semibold text-sm tracking-tight text-[#171717]">
              Admin{" "}
              <span className="text-[#8f8f8f] font-normal">Dashboard</span>
            </span>
          </div>

          {user && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  path.startsWith("/products")
                    ? "bg-[#171717] text-white font-medium"
                    : "text-[#4d4d4d] hover:text-[#171717] hover:bg-[#ebebeb]/60"
                }`}
              >
                Products
              </button>
            </nav>
          )}
        </div>

        {/* User Status / Logout */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 py-1 text-xs text-[#4d4d4d]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-6 h-6 rounded-full border border-[#ebebeb] object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#171717] text-white flex items-center justify-center font-medium text-[10px]">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <span className="hidden sm:inline  text-[11px] text-[#171717]">
                @{user.username}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-[#171717] bg-white border border-[#ebebeb] hover:border-[#171717] px-2.5 py-1 rounded-md transition-all font-medium active:scale-95 shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-xs text-white bg-[#171717] px-3 py-1.5 rounded-md transition-all font-medium hover:bg-neutral-800"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
