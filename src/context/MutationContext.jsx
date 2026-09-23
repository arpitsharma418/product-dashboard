import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const MutationContext = createContext(null);

const STORAGE_KEY = "dummyjson_local_mutations";

export const MutationProvider = ({ children }) => {
  const [mutations, setMutations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : { added: [], updated: {}, deleted: [] };
    } catch {
      return { added: [], updated: {}, deleted: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mutations));
  }, [mutations]);

  const addLocalProduct = useCallback((product) => {
    setMutations((prev) => ({
      ...prev,
      added: [product, ...prev.added],
    }));
  }, []);

  const updateLocalProduct = useCallback((id, updatedData) => {
    setMutations((prev) => {
      const inAdded = prev.added.some((p) => String(p.id) === String(id));
      if (inAdded) {
        return {
          ...prev,
          added: prev.added.map((p) =>
            String(p.id) === String(id) ? { ...p, ...updatedData } : p,
          ),
        };
      }
      return {
        ...prev,
        updated: {
          ...prev.updated,
          [id]: { ...(prev.updated[id] || {}), ...updatedData },
        },
      };
    });
  }, []);

  const deleteLocalProduct = useCallback((id) => {
    setMutations((prev) => ({
      ...prev,
      added: prev.added.filter((p) => String(p.id) !== String(id)),
      deleted: [...new Set([...prev.deleted, String(id)])],
    }));
  }, []);

  const resetMutations = useCallback(() => {
    setMutations({ added: [], updated: {}, deleted: [] });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <MutationContext.Provider
      value={{
        mutations,
        addLocalProduct,
        updateLocalProduct,
        deleteLocalProduct,
        resetMutations,
      }}
    >
      {children}
    </MutationContext.Provider>
  );
};

export const useMutations = () => {
  const context = useContext(MutationContext);
  if (!context) {
    throw new Error("useMutations must be used within MutationProvider");
  }
  return context;
};
