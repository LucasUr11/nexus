import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface FavoritesContextType {
    favorites: string[]; // Donde iran los ID's de los productos.-
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useLocalStorage<string[]>('nexus-favorites', []);

    const toggleFavorite = (productId: string) => {
        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId) // Si ya estaba, lo quita.-
                : [...prev, productId] // Si no estaba, lo agrega.- 
        );
    };

    const isFavorite = (productId: string) => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
    return context;
}