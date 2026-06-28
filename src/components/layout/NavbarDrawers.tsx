import { Trash2, Plus, Minus, X, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Link } from 'react-router-dom';
import { useProducts } from '../../features/products/hooks/useProducts';

// --- DROPDOWN PARA FAVORITOS ---
export const FavoritesDropDown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

    const { favorites, toggleFavorite } = useFavorites();
    const { products, loading } = useProducts();
    const { addToCart } = useCart();

    // Filtra localmente los productos que estén en favoritos.-
    const favProducts = products.filter(product => favorites.includes(product.id));

    if (!isOpen) return null;
    0
    return (
        <div className="absolute right-0 mt-3 w-80 bg-nexus-surface border border-nexus-border rounded-2xl shadow-xl z-50 p-4 animate-fade-in text-white">

            {/* Cabecera.- */}
            <div className="flex items-center justify-between border-b border-nexus-border/40 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-nexus-text-main">
                        Mis Favoritos ({favorites.length})
                    </h4>
                </div>
                <button onClick={onClose} className="text-nexus-text-muted hover:text-white cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            {/* Cuerpo del Dropdown.- */}
            {loading ? (
                <p className="text-xs text-nexus-brand text-center py-6 animate-pulse">Sincronizando deseos...</p>
            ) : favProducts.length === 0 ? (
                <p className="text-xs text-nexus-text-muted text-center py-6">No tenés productos guardados.</p>
            ) : (
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-nexus-border/20">
                    {favProducts.map((product, index) => {
                        const formattedPrice = new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        }).format(product.price);

                        return (
                            <div
                                key={product.id}
                                className={`flex gap-3 items-center text-white ${index !== 0 ? 'pt-3' : ''}`}
                            >
                                {/* Miniatura.- */}
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-lg bg-nexus-bg border border-nexus-border/30 shrink-0"
                                />

                                {/* Detalles simplificados.- */}
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-bold truncate">{product.name}</h5>
                                    <span className="text-xs text-nexus-text-muted font-medium">{formattedPrice}</span>
                                </div>

                                {/* Acciones rápidas.- */}
                                <div className="flex items-center gap-1 shrink-0">
                                    {product.stock > 0 && (
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="p-1.5 rounded-lg bg-nexus-brand hover:bg-nexus-brand-hover text-white transition-colors cursor-pointer"
                                            title="Agregar al carrito"
                                        >
                                            <ShoppingBag size={12} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleFavorite(product.id)}
                                        className="p-1.5 rounded-lg hover:bg-nexus-bg text-nexus-text-muted hover:text-red-400 transition-colors cursor-pointer"
                                        title="Quitar de favoritos"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- SIDEBAR DEL CARRITO ---
export const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

    const formattedTotal = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(totalPrice);

    return (
        <>
            {/* Backdrop / Fondo oscuro semitransparente */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Panel Lateral Deslizante */}
            <aside className={`fixed top-0 right-0 h-screen w-full sm:w-md bg-nexus-surface border-l border-nexus-border/60 z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Cabecera */}
                <div className="p-6 border-b border-nexus-border/40 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} className="text-nexus-brand" />
                        <h3 className="font-black text-lg uppercase tracking-tight">Tu Carrito</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-nexus-text-muted hover:text-white rounded-xl bg-nexus-bg/50 border border-nexus-border/30 transition-all cursor-pointer"><X size={18} /></button>
                </div>

                {/* Lista de productos (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-nexus-text-muted py-20">
                            <ShoppingBag size={40} className="stroke-[1.5]" />
                            <p className="text-sm font-medium">Tu carrito está vacío</p>
                            <span className="text-xs max-w-50">¡Agregá periféricos premium desde nuestro catálogo!</span>
                        </div>
                    ) : (
                        cart.map((item) => {
                            const itemPrice = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.product.price * item.quantity);
                            return (
                                <div key={item.product.id} className="flex gap-4 bg-nexus-bg/50 p-3 rounded-xl border border-nexus-border/30 text-white items-center">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg bg-nexus-surface border border-nexus-border/30" />

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-white truncate">{item.product.name}</h4>
                                        <span className="text-xs text-nexus-brand font-semibold block mt-0.5">{itemPrice}</span>

                                        {/* Selector de cantidad mini */}
                                        <div className="flex items-center gap-1 mt-2">
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded bg-nexus-surface hover:text-nexus-brand transition-colors border border-nexus-border/40"><Minus size={12} /></button>
                                            <span className="text-xs px-2 font-bold min-w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded bg-nexus-surface hover:text-nexus-brand transition-colors border border-nexus-border/40"><Plus size={12} /></button>
                                        </div>
                                    </div>

                                    {/* Botón basurero */}
                                    <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-nexus-text-muted hover:text-red-400 transition-colors cursor-pointer" aria-label="Eliminar producto"><Trash2 size={16} /></button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer del Carrito con Subtotal */}
                {cart.length > 0 && (
                    <div className="p-6 bg-nexus-bg/40 border-t border-nexus-border/40 space-y-4 text-white">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-nexus-text-muted font-medium">Subtotal acumulado:</span>
                            <span className="text-xl font-black tracking-tight text-white">{formattedTotal}</span>
                        </div>
                        <Link 
                            to="/checkout"
                            onClick={onClose} 
                        >
                            <button className="w-full bg-nexus-brand hover:bg-nexus-brand-hover py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md active:scale-[0.99] cursor-pointer">
                                Iniciar Proceso de Pago
                            </button>
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
};