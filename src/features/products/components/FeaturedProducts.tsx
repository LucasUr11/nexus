import { ProductCard } from "./ProductCard";
import { type Product } from "../types";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedProductsProps {
    products: Product[];
}

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {

    // En un fututo sera: const featured = products.filter(p => p.isFeatured).slice(0, 4);
    const featured = products.slice(0, 4);

    if (featured.length === 0) return null;

    return (
        <section className="w-full py-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">

                {/* Encabezado.- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 text-left">
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-nexus-brand bg-nexus-brand/10 border border-nexus-brand/20 rounded-md px-2.5 py-1 inline-block mb-2">
                            Drop de Temporada
                        </h2>
                        <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight italic">
                            Productos Destacados
                        </h3>
                    </div>

                    {/* Enlace rápido al catálogo completo */}
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-nexus-text-muted hover:text-nexus-brand transition-colors group cursor-pointer"
                    >
                        Ver todo el arsenal
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid Responsive.- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featured.map((product) => (
                        <div
                            key={product.id}
                            className="transform hover:-translate-y-1 transition-transform duration-300"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}