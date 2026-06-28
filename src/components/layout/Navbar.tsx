import { useState } from 'react';
import { Search, ShoppingCart, Heart, X, Menu } from 'lucide-react';
import { Logo } from '../../assets/Logo';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { FavoritesDropDown, CartSidebar } from './NavbarDrawers';

export const Navbar = () => {

    const { favorites } = useFavorites();
    const { totalItems } = useCart();

    // Controlan los menus flotantes.-
    const [isFavOpen, setIsFavOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const hasFavorites = favorites.length > 0;

    const navLinks = [
        { name: "Catálogo", to: "/catalog" },
        { name: "Teclados", to: "/catalog?category=Teclados" },
        { name: "Mouse", to: "/catalog?category=Mouse" },
        { name: "Audio", to: "/catalog?category=Audio" },
    ]

    const [isOpenMenu, setIsOpenMenu] = useState(false);

    return (
        <header className="w-full bg-nexus-bg border-b border-nexus-border sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Fila principal- */}
                <div className="flex items-center justify-between h-16 md:h-20 gap-4">

                    {/* Buscador.- */}
                    <div className="flex-1 flex items-center">
                        <div className="relative w-full max-w-xs group">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full bg-nexus-surface border border-nexus-border rounded-full py-1.5 pl-10 pr-4 text-sm text-nexus-text-main placeholder-nexus-text-muted/60 focus:outline-none focus:border-nexus-brand focus:ring-1 focus:ring-nexus-brand transition-all hidden md:block"
                            />
                            <button className="p-2 text-nexus-text-muted hover:text-nexus-text-main md:hidden" aria-label="Buscar">
                                <Search size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Logo Central.- */}
                    <div className="shrink-0 flex items-center px-4">
                        <Logo size="lg" />
                    </div>

                    {/* Herramientas / Iconos de accion.- */}
                    <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">

                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setIsFavOpen(!isFavOpen)
                                    setIsCartOpen(false); // Para cerrar el carrito (si esta abierto) para abrir Favoritos.-
                                }}
                                className="p-2 text-nexus-text-muted hover:text-white transition-colors relative cursor-pointer" aria-label="Favoritos"
                            >
                                <Heart size={20} className={hasFavorites ? 'text-red-500 fill-red-500' : 'transition-colors'} />
                                {hasFavorites && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-nexus-bg animate-pulse" />
                                )}
                            </button>

                            <FavoritesDropDown isOpen={isFavOpen} onClose={() => setIsFavOpen(false)} />
                        </div>

                        {/* Boton del Carrito.- */}
                        <button 
                            onClick={() => {
                                setIsCartOpen(true);
                                setIsFavOpen(false); // Para cerrar Favoritos (si esta abierto) para abrir el Carrito.-
                            }}
                            className="relative p-2 text-nexus-text-muted hover:text-nexus-text-main transition-colors cursor-pointer" aria-label="Carrito"
                        >
                            <div className="relative">
                                <ShoppingCart size={22} className={totalItems > 0 ? 'text-nexus-brand' : ''} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2.5 bg-nexus-brand text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-nexus-bg">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Fila inferior.- */}
            <nav className="hidden md:flex items-center justify-center gap-12 h-12 border-t border-nexus-border/40">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.to}
                        className="text-sm font-medium text-nexus-text-muted hover:text-white hover:tracking-wide transition-all duration-200 relative pb-1 group"
                    >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-nexus-brand group-hover:w-full transition-all duration-300"></span>
                    </Link>
                ))}
            </nav>

            {/* Sidebar lateral del Carrito.- */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Fila inferior para Mobiles.- */}
            <div className="flex md:hidden items-center justify-center h-10 border-t border-nexus-border/30">
                <button
                    onClick={() => setIsOpenMenu(!isOpenMenu)}
                    className="text-nexus-text-muted hover:text-white p-1 transition-colors flex items-center gap-1.5 cursor-pointer"
                    aria-label="Abrir menú de navegación"
                >
                    {isOpenMenu ? <X size={20} /> : <Menu size={20} />}
                    <span className="text-xs uppercase tracking-widest font-medium">Categorías</span>
                </button>
            </div>

            {/* Despliegue Responsive de Categorias.- */}
            <div
                className={`fixed inset-x-0 top-26.25 bottom-0 bg-nexus-bg/95 backdrop-blur-md z-40 md:hidden transition-all duration-300 transform border-t border-nexus-border/60 
                    ${isOpenMenu ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }
                `}
            >
                <nav className="flex flex-col items-center justify-center gap-8 h-full pb-24">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            onClick={() => setIsOpenMenu(false)}
                            className="text-xl font-medium text-nexus-text-main hover:text-nexus-brand transition-colors tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}