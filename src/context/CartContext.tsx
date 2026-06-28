import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type Product } from "../features/products/types";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    updateQuantity: (productId: string, newQuantity: number) => void;
    removeFromCart: (productId: string) => void;
    totalItems: number;
    totalPrice: number;
    clearCart: () => void;
    loadCartItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useLocalStorage<CartItem[]>('nexus-cart', []);
    const clearCart = () => setCart([]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id);

            if (existingItem) {
                
                // Si el producto ya esta en el carrito, verifica el stock y lo suma.-
                if (existingItem.quantity >= product.stock) {
                    alert("No hay mas stock disponible de este producto.");
                    return prevCart;
                }
                return prevCart.map((item) => 
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1} : item
                );
            }

            // Si es un producto nuevo en el carrito.-
            return [...prevCart, { product, quantity:1 }];
        });
    };

    // "Pisa" el carrito con los productos recuperados.-
    const loadCartItems = (items: CartItem[]) => {
        setCart(items);
    }

    // Modifica la cantidad.-
    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.product.id === productId) {
                    if (newQuantity > item.product.stock) {
                        alert("Has alcanzado el límite de stock disponible.");
                        return item;
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    // Elimina el producto.-
    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
    }

    // Calcula la cantidad total sumando las propiedades 'quantity'
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Calcula el dinero acumulado total.-
    const totalPrice = cart.reduceRight((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart, loadCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart debe usarse dentro de CartProvider.');
    return context;
};