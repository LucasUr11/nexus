import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type Product } from "../features/products/types";

interface BannerProps {
    products: Product[];
}

export const Banner = ({ products }: BannerProps) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // Primero 3 productos de la BD.-
    const featuredProducts = products.slice(0, 3);

    // Función para ir cambiando la imagen.-
    const nextSlide = useCallback(() => {
        if (featuredProducts.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, [featuredProducts.length]);

    // Cambia la imagen automaticamente cada 5s.-
    useEffect(() => {
        if (featuredProducts.length <= 1) return;
        const timber = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timber);
    }, [nextSlide, featuredProducts.length]);

    // Por si la base de datos tarda.-
    if (featuredProducts.length === 0) {
        return (
            <div className="w-full h-[50vh] md:h-[75vh] bg-nexus-surface border border-nexus-border/60 rounded-3xl animate-pulse flex items-center justify-center">
                <span className="text-xs text-nexus-text-muted uppercase tracking-widest font-bold">Cargando destacados...</span>
            </div>
        );
    }

    const currentProduct = featuredProducts[currentIndex];

    return (
        <section className="w-full h-[60vh] md:h-[80vh] bg-nexus-surface border border-nexus-border rounded-3xl relative overflow-hidden group">

            {/* CAPA DE IMÁGENES */}
            {featuredProducts.map((product, index) => (
                <div
                    key={product.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.02] transition-transform duration-700"
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />

                    {/* 📱 Capa de degradado.- */}
                    <div className="absolute inset-0 bg-linear-to-t from-nexus-bg via-nexus-bg/40 to-transparent md:bg-linear-to-r md:from-nexus-bg/95 md:via-nexus-bg/40 md:to-transparent" />
                </div>
            ))}

            {/* Contenido en la esquina.- */}
            <div className="absolute inset-0 flex items-end md:items-center justify-start p-6 sm:p-10 md:p-16 z-20">
                <div className="max-w-md space-y-2.5 md:space-y-4 text-left pb-4 md:pb-0">

                    {/* Tag de Categoría.- */}
                    <span className="inline-block text-[10px] md:text-xs font-black tracking-widest text-nexus-brand bg-nexus-brand/10 border border-nexus-brand/20 rounded-md px-2.5 py-1 uppercase">
                        Destacado: {currentProduct.category}
                    </span>

                    {/* Título.- */}
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white line-clamp-2 uppercase italic leading-none">
                        {currentProduct.name}
                    </h1>

                    {/* Descripción.- */}
                    <p className="text-xs sm:text-sm text-nexus-text-muted leading-relaxed line-clamp-2 md:line-clamp-3 max-w-sm md:max-w-none">
                        {currentProduct.description}
                    </p>

                    {/* Boton que redirigue al detalle del producto.- */}
                    <div className="pt-2 md:pt-4">
                        <button
                            onClick={() => navigate(`/catalog/${currentProduct.id}`)}
                            className="inline-flex items-center gap-2 bg-nexus-brand hover:bg-nexus-brand-hover text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl px-5 py-3 shadow-lg shadow-nexus-brand/20 hover:shadow-nexus-brand/30 transition-all cursor-pointer active:scale-[0.98]"
                        >
                            Ver Detalle
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Indicador en la esquina inferior derecha.- */}
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-12 flex items-center gap-2 z-20 bg-nexus-bg/40 backdrop-blur-md px-3 py-2 rounded-full border border-nexus-border/30">
                {featuredProducts.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="p-1 focus:outline-none cursor-pointer group"
                        aria-label={`Ir al slide ${index + 1}`}
                    >
                        <div
                            className={`h-1.5 rounded-full transition-all duration-300 
                                ${index === currentIndex
                                    ? 'w-6 bg-nexus-brand'
                                    : 'w-2 bg-nexus-text-muted/30 group-hover:bg-nexus-text-muted/60'
                                }`
                            }
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}