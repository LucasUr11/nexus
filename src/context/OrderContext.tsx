import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type CartItem } from "./CartContext";

export interface Order {
    id: string; // Número de orden único
    date: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        notes?: string;
    };
    items: CartItem[];
    total: number;
}

interface OrderContextType {
    orders: Order[];
    createOrder: (customer: Order["customer"], items: CartItem[], total: number) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useLocalStorage<Order[]>('nexus-orders', []);

    const createOrder = (customer: Order["customer"], items: CartItem[], total: number) => {
        // Generamos un identificador numérico único basado en la fecha y un ramdomizador corto
        const orderNum = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear();
        
        const newOrder: Order = {
            id: `NX-${year}-${orderNum}`,
            date: new Date().toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            customer,
            items,
            total
        };

        setOrders((prevOrders) => [newOrder, ...prevOrders]); // Lo mandamos al tope de la lista
        return newOrder;
    };

    return (
        <OrderContext.Provider value={{ orders, createOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders debe usarse dentro de OrderProvider.');
    return context;
};