import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "../context/RouterContext";

import { Logo } from "../components/Logo";

export const LoginPage = () => {
  const { login, loading, error, clearError } = useAuth();
  const { navigate } = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!username.trim()) errs.username = "Username is required";
    if (!password.trim()) errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    if (!validate()) return;

    const result = await login(username, password);
    if (result.success) {
      navigate("/products", { replace: true });
    }
  };

  const handleFillDemo = (u, p) => {
    setUsername(u);
    setPassword(p);
    clearError();
    setFieldErrors({});
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 bg-[#fafafa]">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-[#ebebeb] rounded-xl p-6 sm:p-8 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo size={42} />
            </div>
            <span className=" text-[11px] font-medium tracking-wider text-[#8f8f8f] uppercase">
              AUTHENTICATION
            </span>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#171717] mt-1">
              Welcome back
            </h1>
            <p className="text-xs text-[#8f8f8f] mt-1.5">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-[#ee0000] flex items-start gap-2">
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <span className="font-medium">Authentication Failed:</span>{" "}
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username)
                    setFieldErrors((p) => ({ ...p, username: null }));
                  if (error) clearError();
                }}
                placeholder="emilys"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-md text-[#171717] placeholder-[#a1a1a1] transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.username
                    ? "border-[#ee0000] focus:ring-[#ee0000]"
                    : "border-[#ebebeb] focus:border-[#171717] focus:ring-[#171717]"
                }`}
                disabled={loading}
                autoComplete="username"
              />
              {fieldErrors.username && (
                <p className="text-[11px] text-[#ee0000] mt-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#171717]">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((p) => ({ ...p, password: null }));
                  if (error) clearError();
                }}
                placeholder="********"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-md text-[#171717] placeholder-[#a1a1a1] transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? "border-[#ee0000] focus:ring-[#ee0000]"
                    : "border-[#ebebeb] focus:border-[#171717] focus:ring-[#171717]"
                }`}
                disabled={loading}
                autoComplete="current-password"
              />
              {fieldErrors.password && (
                <p className="text-[11px] text-[#ee0000] mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-9 bg-[#171717] text-white rounded-md text-xs font-medium tracking-tight hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
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
                  <span>Verifying credentials...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#ebebeb] text-center">
            <p className="text-[11px] text-[#8f8f8f] mb-2  uppercase tracking-wider">
              DummyJSON Preset Accounts
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleFillDemo("emilys", "emilyspass")}
                className="px-2.5 py-1 text-[11px]  bg-[#fafafa] border border-[#ebebeb] rounded-md text-[#4d4d4d] hover:text-[#171717] hover:border-[#171717] transition-all"
              >
                emilys / emilyspass (Default)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("michaelw", "michaelwpass")}
                className="px-2.5 py-1 text-[11px]  bg-[#fafafa] border border-[#ebebeb] rounded-md text-[#4d4d4d] hover:text-[#171717] hover:border-[#171717] transition-all"
              >
                michaelw / michaelwpass
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#8f8f8f] mt-4 ">
          Powered by DummyJSON API & Geist Design System
        </p>
      </div>
    </div>
  );
};
