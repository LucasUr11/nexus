import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { type Product } from "../types";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    // La peticion se envuelve en un Callback para poder exportarla.-
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: supabaseError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (supabaseError) throw supabaseError;

            if (data) {
                const mappedProducts: Product[] = data.map((item: any) => ({
                    id: String(item.id), // Aseguramos que sea string puro
                    name: item.name,
                    brand: item.brand || "",
                    description: item.description,
                    price: Number(item.price),
                    imageUrl: item.image_url,
                    category: item.category,
                    stock: item.stock,
                    specifications: item.specifications || {},
                    variants: item.variants || [],
                    isFavorite: item.is_favorite || false,
                }));
                setProducts(mappedProducts);
            }
        } catch (err: any) {
            console.error("Error cargando productos:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refreshProducts: fetchProducts };
};