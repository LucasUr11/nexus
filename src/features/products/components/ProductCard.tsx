import { Heart, ShoppingCart } from 'lucide-react';
import { type Product } from '../types';
import { useFavorites } from '../../../context/FavoritesContext';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {

    const { id, name, description, price, imageUrl, stock } = product;

    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToCart } = useCart();

    const favoriteActive = isFavorite(id);
    const hasStock = stock > 0;

    const navigate = useNavigate();

    // Dirige a la URL del detalle.-
    const handleCardClick = () => {
        navigate(`/catalog/${id}`);
    };

    // Formateador de moneda moderno (Estándar ARS)
    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(price);

    return (
        <article
            onClick={handleCardClick}
            className="group bg-nexus-surface hover:border-nexus-brand/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative border border-nexus-surface cursor-pointer"
        >

            {/* Botón de Favoritos flotante */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(id);
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-nexus-bg/80 backdrop-blur-md text-nexus-text-muted hover:text-red-500 hover:scale-110 active:scale-95 border border-nexus-border/40 transition-all cursor-pointer"
                aria-label={favoriteActive ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
                <Heart
                    size={18}
                    className={favoriteActive ? "fill-red-500 text-red-500" : "transition-colors"}
                />
            </button>

            {/* Contenedor de Imagen */}
            <div className="aspect-square w-full bg-nexus-bg overflow-hidden relative">
                <img
                    src={imageUrl}
                    alt={name}
                    loading="lazy" // Optimización nativa de carga
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge de Stock */}
                {!hasStock && (
                    <div className="absolute inset-0 bg-nexus-bg/70 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-500/90 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-md shadow-sm">
                            Sin Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Información del Producto */}
            <div className="p-5 flex flex-col flex-1 gap-2">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-nexus-text-main line-clamp-1 group-hover:text-nexus-brand transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm text-nexus-text-muted line-clamp-2 mt-1 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Fila de Precio y Compra */}
                <div className="pt-4 mt-2 border-t border-nexus-border/30 flex items-center justify-between gap-4">
                    <span className="text-sm lg:text-lg font-bold text-white tracking-tight">
                        {formattedPrice}
                    </span>

                    <button
                        disabled={!hasStock}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className={`p-2 lg:p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer
                            ${hasStock
                                ? 'bg-nexus-brand hover:bg-nexus-brand-hover text-white border-transparent shadow-sm hover:scale-105 active:scale-95'
                                : 'bg-nexus-surface text-nexus-text-muted/40 border-nexus-border/40 cursor-not-allowed'
                            }
                        `}
                        aria-label="Agregar al carrito"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </article>
    );
}