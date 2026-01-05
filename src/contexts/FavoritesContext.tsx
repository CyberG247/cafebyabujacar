import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  getFavoritesCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'cafe-favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const getFavoritesCount = () => favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        getFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
