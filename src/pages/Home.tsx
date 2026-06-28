import { useProducts } from "../features/products/hooks/useProducts";
import { Banner } from "./Banner";
import { Footer } from "../components/layout/Footer";
import { Features } from "./Features";
import { FeaturedProducts } from "../features/products/components/FeaturedProducts";
import { CategorySection } from "./CategorySection";
import { HojaInformativa } from "./HojaInformativa";

export const Home = () => {

    const { products, loading } = useProducts();
    return (
        <div className="min-h-screen bg-nexus-bg text-nexus-text-main antialiased selection:bg-nexus-brand/30 selection:text-white">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">

                {loading ? (
                    <div className="w-full h-[52vh] sm:h-[60vh] md:h-[75vh] bg-nexus-surface border border-nexus-border/60 rounded-3xl animate-pulse flex items-center justify-center">
                        <span className="text-xs text-nexus-text-muted uppercase tracking-widest font-bold">Conectando con Supabase...</span>
                    </div>
                ) : (
                    <Banner products={products} />
                )}

                <Features />
                <CategorySection />
                <FeaturedProducts products={products} />

                {/* SECCIÓN DE PRODUCTOS DESTACADOS PASANDO LA DATA DE SUPABASE */}
                {/*! loading && <FeaturedProducts products={products} /> */}
                <HojaInformativa />
            </main>

            <Footer />
        </div>
    )
}