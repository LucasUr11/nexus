import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../features/products/components/ProductGrid";
import { SlidersHorizontal, RefreshCw, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { useProducts } from "../features/products/hooks/useProducts";
import { useEffect, useState } from "react";
import { type CategoryType } from "../features/products/types";

const CATEGORIES: CategoryType[] = ['Teclados', 'Mouse', 'Audio', 'Mousepads', 'Componentes', 'Accesorios'];

export const Catalog = () => {

    // Lector de parametros en la URL.-
    const [searchParams, setSearchParams] = useSearchParams();

    // Extrae el valor '?category=...'.-
    const currentCategory = searchParams.get("category"); // Parametro de Categoria.-
    const currentBrand = searchParams.get("brand"); // Parametro de Marca.-

    // Estados para controlar los filtros.-
    const isDesktopInitial = window.innerWidth >= 1024;
    const [isOpenPrice, setOpenPrice] = useState(isDesktopInitial);
    const [isOpenStock, setOpenStock] = useState(isDesktopInitial);
    const [isOpenBrands, setOpenBrands] = useState(isDesktopInitial);

    // Estados para los valores filtrados.-
    const [maxPrice, setMaxPrice] = useState<number>(500000);
    const [onlyWithStock, setOnlyWithStock] = useState<boolean>(false);

    // Extrae los productos de la base de datos.-
    const { products, loading: isLoading } = useProducts();

    // Extrae la marcas unicas dinamicamente.-
    const availableBrands = Array.from(
        new Set(products.map(p => p.brand).filter(Boolean))
    ).sort();

    // Control responsive por si el usuario estira la pantalla.-
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setOpenPrice(true);
                setOpenStock(true);
                setOpenBrands(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Flujo de filtrado multiple.-
    const filteredProducts = products.filter(product => {
        // Filtado por categoria.-
        const matchsCategory = currentCategory
            ? product.category.toLowerCase() === currentCategory.toLowerCase()
            : true;

        // Filtrado por marca.-
        const matchesBrand = currentBrand
            ? product.brand?.toLowerCase() === currentBrand.toLowerCase()
            : true;

        // Filtrado por precio maximo.-
        const matchesPrice = product.price <= maxPrice;

        // Filtrado por disponibilidad.-
        const matchesStock = onlyWithStock ? product.stock > 0 : true;

        return matchsCategory && matchesBrand && matchesPrice && matchesStock;
    });

    // Setea parametros individuales.-
    const handleSetParam = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(key, value);
        setSearchParams(newParams);
    };

    // Remueve un parametro en especifico.-
    const handleRemoveParam = (key: string) => {
        const newParmas = new URLSearchParams(searchParams);
        newParmas.delete(key);
        setSearchParams(newParmas);
    }

    // Funcion para "Limpiar Filtros".-
    const handleClearFilters = () => {
        setSearchParams({}); // Limpia todos los query params de la URL.-
        setMaxPrice(500000);
        setOnlyWithStock(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="min-h-screen bg-nexus-bg text-nexus-text-main pt-8 pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Barra superior.- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-nexus-surface border border-nexus-border/40 p-4 rounded-xl mb-8 ">
                    <h2 className="text-white font-black uppercase tracking-tight text-base italic">
                        Catálogo Nexus
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {currentCategory && (
                            <span className="bg-nexus-brand/10 text-nexus-brand border border-nexus-brand/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-fade-in">
                                Categoría: {currentCategory}
                                <X size={12} className="cursor-pointer hover:text-white" onClick={() => handleRemoveParam("category")} />
                            </span>
                        )}
                        {currentBrand && (
                            <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-fade-in">
                                Marca: {currentBrand}
                                <X size={12} className="cursor-pointer hover:text-white" onClick={() => handleRemoveParam("brand")} />
                            </span>
                        )}
                    </div>
                </div>

                {/* Contenedor del Sidebar.- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Columna izquierda.- */}
                    <aside className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:sticky lg:top-24">
                        <div className="sm:col-span-2 lg:col-span-1 flex flex-wrap justify-between items-center bg-nexus-surface/50 border border-nexus-border/40 px-4 py-3 rounded-xl">
                            <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                                <SlidersHorizontal size={14} className="text-nexus-brand" /> Filtros Avanzados
                            </span>
                            {(currentCategory || currentBrand || onlyWithStock || maxPrice < 500000) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="text-[9px] uppercase font-black text-nexus-text-muted hover:text-nexus-brand flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                    <RefreshCw size={10} /> Limpiar todo
                                </button>
                            )}
                        </div>

                        {/* Filtro: Categorias.- */}
                        <div className="bg-nexus-surface border border-nexus-border/60 rounded-xl overflow-hidden p-2 space-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-nexus-text-muted block px-2 pb-1">Categorías</span>

                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleSetParam("category", cat)}
                                    className={`w-full text-left text-xs font-bold py-2 px-3 rounded-lg transition-all cursor-pointer ${currentCategory?.toLowerCase() === cat.toLowerCase()
                                        ? 'bg-nexus-brand text-white shadow-sm'
                                        : 'text-nexus-text-muted hover:bg-nexus-bg/50 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>


                        {/* Filtro de Marcas.- */}
                        {availableBrands.length > 0 && (
                            <div className="p-2 bg-nexus-surface border border-nexus-border/60 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenBrands(!isOpenBrands)}
                                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-nexus-brand transition-colors text-left cursor-pointer"
                                >
                                    Marcas {isOpenBrands ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>

                                {isOpenBrands && (
                                    <div className="space-y-1 pt-2 animate-fade-in max-h-48 overflow-y-auto">
                                        {availableBrands.map((brand) => (
                                            <button
                                                key={brand}
                                                onClick={() => handleSetParam("brand", brand)}
                                                className={`w-full flex items-center justify-between text-xs font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer ${currentBrand?.toLowerCase() === brand.toLowerCase()
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : 'text-nexus-text-muted hover:bg-nexus-bg/50 hover:text-white'
                                                    }`}
                                            >
                                                <span>{brand}</span>
                                                {currentBrand?.toLowerCase() === brand.toLowerCase() && <Check size={12} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Filtro: Rango de precios.- */}
                        <div className="p-2 bg-nexus-surface border border-nexus-border/60 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenPrice(!isOpenPrice)}
                                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-nexus-brand transition-colors text-left cursor-pointer"
                            >
                                Precio Máximo {isOpenPrice ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {isOpenPrice && (
                                <div className="space-y-2 pt-2 animate-fade-in">
                                    <input
                                        type="range"
                                        min="0"
                                        max="500000"
                                        step="5000"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full accent-nexus-brand bg-nexus-bg h-1.5 rounded-lg appearance-none cursor-pointer border border-nexus-border/30"
                                    />
                                    <div className="flex justify-between items-center text-[11px] font-bold text-nexus-text-muted">
                                        <span>$0</span>
                                        <span className="text-nexus-brand bg-nexus-brand/5 px-2 py-0.5 rounded border border-nexus-brand/10 text-xs">
                                            Hasta {formatCurrency(maxPrice)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filtro: Stock.- */}
                        <div className="p-2 bg-nexus-surface border border-nexus-border/60 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenStock(!isOpenStock)}
                                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-nexus-brand transition-colors text-left cursor-pointer"
                            >
                                Disponibilidad {isOpenStock ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {isOpenStock && (
                                <div className="pt-2 animate-fade-in">
                                    <label className="flex items-center gap-3 cursor-pointer group text-sm text-nexus-text-main select-none">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={onlyWithStock}
                                                onChange={(e) => setOnlyWithStock(e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-4 h-4 bg-nexus-bg border border-nexus-border rounded peer-checked:bg-nexus-brand peer-checked:border-nexus-brand transition-all flex items-center justify-center group-hover:border-nexus-brand" />
                                            <svg className="absolute w-2.5 h-2.5 text-white left-0.75 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-xs text-nexus-text-muted group-hover:text-white transition-colors">
                                            Solo productos con Stock
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Columna derecha.- */}
                    <main className="w-full lg:col-span-3">

                        {/* Flujo de renderizado segun el estado.- */}
                        {isLoading ? (
                            // Estado de carga.-
                            <div className="flex flex-col items-center justify-center py-24 gap-3 text-nexus-text-muted">
                                <RefreshCw size={32} className="animate-spin text-nexus-brand" />
                                <p className="text-sm font-medium tracking-wide">Sincronizando catálogo...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-nexus-border rounded-2xl bg-nexus-surface/30 animate-fade-in">
                                <p className="text-nexus-text-muted">No se encontraron productos en la categoría "{currentCategory}".</p>
                            </div>
                        ) : (
                            <ProductGrid products={filteredProducts} /> // Renderiza los productos filtrados.-
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}