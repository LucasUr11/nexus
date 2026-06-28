import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    
    // El estado intenta leer de localStorage.-
    const [storedValue, setStoreValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
    
            // Si existe el elemento en localStorage, lo parsea; si no, usa el valor inicial.-
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error leyendo la clave "${key}" de localStorage: `, error);
            return initialValue;
        }
    });

    // Escucha los cambios en el estado para actualizar el localStorage de forma automarica.-
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error leyendo la clave "${key}" de localStorage: `, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoreValue];
}