import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { supabase } from "../../../lib/supabase";
import { type Product } from "../types";
import { useFavorites } from "../../../context/FavoritesContext";
import { useCart } from "../../../context/CartContext";

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()

    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Busca el producto en la base de datos utilizando el ID de la URL.-
    useEffect(() => {
        const fecthProduct = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                
                if (data) {
                    const mappedProduct: Product = {
                        id: data.id,
                        name: data.name,
                        brand: data.brand || "",
                        description: data.description,
                        price: Number(data.price),
                        imageUrl: data.image_url,
                        category: data.category,
                        stock: data.stock,
                        specifications: data.specifications || {},
                        variants: data.variants || [],
                        isFavorite: data.is_favorite
                    };

                    setProduct(mappedProduct);
                }
            } catch (err) {
                console.error("Error cargando el detalle del producto: ", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fecthProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-full bg-nexus-bg flex items-center justify-center text-white">
                <span className="animate-pulse text-nexus-brand font-medium">Cargando especificaciones...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-4">
                <p className="text-nexus-text-muted">El producto solicitado no existe o fue removido.</p>
                <button onClick={() => navigate('/catalog')} className="text-nexus-brand hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Volver al catálogo
                </button>
            </div>
        );
    }

    const favoriteActive = isFavorite(product.id);
    const hasStock = product.stock > 0;

    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(product.price);

    return (
        <main className="bg-nexus-bg text-white min-h-screen animate-fade-in">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

                {/* Botón Volver.- */}
                <button
                    onClick={() => navigate(-1)} // Vuelve a la seccion anterior.-
                    className="inline-flex items-center gap-2 text-nexus-text-muted hover:text-nexus-brand-hover mb-2 md:mb-4 transition-colors group text-sm font-medium cursor-pointer"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al catálogo
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 bg-nexus-surface border border-nexus-border/40 rounded-3xl p-4 sm:p-8 shadow-xl">

                    {/* Bloque Izquierdo.- */}
                    <div className="w-full aspect-square bg-nexus-bg rounded-2xl overflow-hidden relative border border-nexus-border/20">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        />

                        {/* Botón de Favorito.- */}
                        <button
                            onClick={() => toggleFavorite(product.id)}
                            className="absolute top-4 right-4 p-3 rounded-full bg-nexus-bg/90 backdrop-blur-md text-nexus-text-muted hover:text-red-500 hover:scale-110 transition-all shadow-md border border-nexus-border/50 cursor-pointer"
                            aria-label="Añadir a favoritos"
                        >
                            <Heart size={22} className={favoriteActive ? "fill-red-500 text-red-500" : ""} />
                        </button>
                    </div>

                    {/* Bloque Derecho.- */}
                    <div className="flex flex-col h-full justify-between gap-6">

                        {/* Detalles.- */}
                        <div>
                            <span className="text-xs font-bold text-nexus-brand uppercase tracking-widest bg-nexus-brand/10 px-3 py-1 rounded-full border border-nexus-brand/20">
                                Garantía Oficial
                            </span>

                            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-4 text-nexus-text-main">
                                {product.name}
                            </h1>

                            <p className="text-3xl font-extrabold text-white tracking-tight mt-4">
                                {formattedPrice}
                            </p>

                            <div className="mt-6 pt-6 border-t border-nexus-border/40">
                                <h2 className="text-sm font-bold tracking-wider text-nexus-text-muted uppercase">Descripción del Producto</h2>
                                <p className="text-base text-nexus-text-muted leading-relaxed mt-2 whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* Acciones y stock.- */}
                        <div className="space-y-4 pt-6 border-t border-nexus-border/40">
                            <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${hasStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-sm font-semibold">
                                    {hasStock ? `Stock disponible (${product.stock} unidades)` : 'Sin stock disponible momentáneamente'}
                                </span>
                            </div>

                            {/* Botón de compra.- */}
                            <button
                                disabled={!hasStock}
                                onClick={() => addToCart(product)}
                                className={`w-full py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all text-base cursor-pointer
                                ${hasStock
                                        ? 'bg-nexus-brand hover:bg-nexus-brand-hover text-white shadow-lg shadow-nexus-brand/10 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-nexus-bg border border-nexus-border/60 text-nexus-text-muted/40 cursor-not-allowed'
                                    }
                            `}
                            >
                                <ShoppingCart size={20} />
                                {hasStock ? 'Agregar al carrito de compras' : 'Producto sin Stock'}
                            </button>

                            {/* Beneficios.- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-nexus-text-muted">
                                <div className="flex items-center gap-2 p-3 bg-nexus-bg/50 rounded-xl border border-nexus-border/20">
                                    <Truck size={16} className="text-nexus-brand" />
                                    <span>Envíos rápidos a todo el país</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-nexus-bg/50 rounded-xl border border-nexus-border/20">
                                    <ShieldCheck size={16} className="text-nexus-brand" />
                                    <span>Compra 100% protegida</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}