import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode}) => {
    
    // Guarda un booleano (true o false) en el localStorage para recordar si ya se inicio o no sesión.-
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('nexus-auth', false);

    const login = (password: string): boolean => {

        // Clave de temporal para las pruebas del admin.-
        if (password === 'admin123') {
            setIsAuthenticated(true);
            return true;
        }

        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hooks personalizado para consumir la autenticacion de forma mas sencilla.-
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider.');
    return context;
};