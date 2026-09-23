import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const RouterContext = createContext(null);

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParamsState] = useState(
    new URLSearchParams(window.location.search),
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((to, options = { replace: false }) => {
    const url = new URL(to, window.location.origin);
    if (options.replace) {
      window.history.replaceState(null, "", url.toString());
    } else {
      window.history.pushState(null, "", url.toString());
    }
    setCurrentPath(url.pathname);
    setSearchParamsState(new URLSearchParams(url.search));
  }, []);

  const setSearchParams = useCallback(
    (newParams, options = { replace: false }) => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(
        typeof newParams === "function" ? newParams(searchParams) : newParams,
      );
      url.search = params.toString();

      if (options.replace) {
        window.history.replaceState(null, "", url.toString());
      } else {
        window.history.pushState(null, "", url.toString());
      }
      setSearchParamsState(params);
    },
    [searchParams],
  );

  return (
    <RouterContext.Provider
      value={{
        path: currentPath,
        searchParams,
        navigate,
        setSearchParams,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};
