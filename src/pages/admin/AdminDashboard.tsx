import { useState } from "react";
import { ProductForm } from "../../features/products/components/ProductForm";
import { type Product } from "../../features/products/types";
import { supabase } from "../../lib/supabase";
import { useProducts } from "../../features/products/hooks/useProducts";
import { Package, RefreshCw, AlertTriangle, Trash2, Edit3, Layers } from "lucide-react";

export const AdminDashboard = () => {

    // Consumo de datos reales y la funcion de refresco nativa.-
    const { products, loading: isLoading, refreshProducts } = useProducts();
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Mapeo local para que se actualice automaticamente sin tener que actualizar la pagina.-
    const [localProducts] = useState<Product[]>([]);

    // Sincroniza el listado inicial cuando el hook termina de cargar.-
    const displayProducts = localProducts.length > 0 || isLoading ? localProducts : products;

    // Calcula el KPIs.-
    const totalProducts = products.length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;

    // Guarda y/o edita en Supabase.-
    const handleSaveOrUpdateProduct = async (productData: Product) => {
        setIsSubmitting(true);
        const isEditing = !!productToEdit;

        try {
            if (isEditing && productToEdit) {
                // UPDATE en la base de datos.-
                const targetId = String(productToEdit.id);

                const { error } = await supabase
                    .from('products')
                    .update({
                        name: productData.name,
                        description: productData.description,
                        price: productData.price,
                        category: productData.category,
                        image_url: productData.imageUrl,
                        stock: productData.stock
                    })
                    .eq('id', targetId); // Machea el texto exacto

                if (error) throw error;
                alert("¡Producto actualizado correctamente en la nube!");
            } else {
                // Modo creación pura
                const { error } = await supabase
                    .from('products')
                    .insert([
                        {
                            id: productData.id,
                            name: productData.name,
                            description: productData.description,
                            price: productData.price,
                            category: productData.category,
                            image_url: productData.imageUrl,
                            stock: productData.stock
                        }
                    ]);

                if (error) throw error;
                alert("¡Producto creado y guardado con éxito!");
            }

            // Forzar actualización visual local e inmediata
            await refreshProducts();
            setProductToEdit(null);
        } catch (error: any) {
            console.error("Error procesando operación: ", error);
            alert(`Error de Supabase: ${error.message || error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Elimina de Supabase.-
    const handleDeleteProduct = async (id: string, name: string) => {
        const confirmDelete = window.confirm(`¿Estás seguro de eliminar "${name}"?`);
        if (!confirmDelete) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', String(id));

            if (error) throw error;

            alert("Producto eliminado del inventario.");
            await refreshProducts();
        } catch (error: any) {
            alert(`No se pudo eliminar: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditMode = (product: Product) => {
        setProductToEdit(product);
        document.getElementById('product-form-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    };

    return (
        <div className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full relative">

            {/* Capa de Loading global.- */}
            {isSubmitting && (
                <div className="absolute inset-0 bg-nexus-bg/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-2xl">
                    <div className="bg-nexus-surface border border-nexus-border p-4 rounded-xl flex items-center gap-3 text-white text-sm shadow-md">
                        <RefreshCw size={18} className="animate-spin text-nexus-brand" />
                        <span>Sincronizando la nube...</span>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight uppercase italic">Panel de Control</h2>
                <p className="text-sm text-nexus-text-muted">Consola central de administración global.</p>
            </div>

            {/* Metricas - KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-nexus-surface border border-nexus-border/60 p-4 rounded-xl flex items-center justify-between text-white shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-nexus-text-muted">Base de Datos</span>
                        <p className="text-2xl font-black">{totalProducts}</p>
                    </div>
                    <div className="bg-nexus-brand/10 p-3 rounded-xl border border-nexus-brand/20 text-nexus-brand">
                        <Package size={20} />
                    </div>
                </div>

                <div className="bg-nexus-surface border border-nexus-border/60 p-4 rounded-xl flex items-center justify-between text-white shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-nexus-text-muted">Sin Stock</span>
                        <p className={`text-2xl font-black ${outOfStockProducts > 0 ? 'text-red-500' : 'text-nexus-text-main'}`}>{outOfStockProducts}</p>
                    </div>
                    <div className={`p-3 rounded-xl border ${outOfStockProducts > 0 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-nexus-border/20 text-nexus-text-muted'}`}>
                        <AlertTriangle size={20} />
                    </div>
                </div>

                <div className="bg-nexus-surface border border-nexus-border/60 p-4 rounded-xl flex items-center justify-between text-white shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-nexus-text-muted">Stock Crítico (≤5)</span>
                        <p className={`text-2xl font-black ${lowStockProducts > 0 ? 'text-amber-500' : 'text-nexus-text-main'}`}>{lowStockProducts}</p>
                    </div>
                    <div className={`p-3 rounded-xl border ${lowStockProducts > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-nexus-border/20 text-nexus-text-muted'}`}>
                        <Layers size={20} />
                    </div>
                </div>
            </div>

            <ProductForm
                onAddProduct={handleSaveOrUpdateProduct}
                productToEdit={productToEdit}
                onCancel={() => setProductToEdit(null)}
            />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Inventario de Productos</h3>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-nexus-text-muted flex items-center justify-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-nexus-brand" /> Cargando listado de hardware...
                    </div>
                ) : displayProducts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-nexus-border rounded-xl text-nexus-text-muted">
                        No hay productos registrados en tu catálogo.
                    </div>
                ) : (
                    <>
                        {/* 📱 MODO MOBILE: Tarjetas apilables en bloque (Ocultas a partir de md:) */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {displayProducts.map((product) => (
                                <div key={product.id} className="bg-nexus-surface border border-nexus-border/60 p-4 rounded-xl space-y-4 shadow-sm text-left">
                                    <div className="flex gap-4 items-start">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            className="w-16 h-16 rounded-xl object-cover border border-nexus-border/40"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold text-nexus-brand bg-nexus-brand/5 px-2 py-0.5 rounded border border-nexus-brand/10 uppercase tracking-wider">
                                                {product.category}
                                            </span>
                                            <h4 className="text-sm font-bold text-white truncate uppercase mt-1">{product.name}</h4>
                                            <p className="text-xs font-semibold text-nexus-brand/90 mt-0.5">{formatCurrency(product.price)}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-nexus-bg/50 px-3 py-2 rounded-lg border border-nexus-border/20 text-xs">
                                        <span className="text-nexus-text-muted">Unidades físicas:</span>
                                        <span className={`font-black ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-green-400'}`}>
                                            {product.stock === 0 ? 'AGOTADO' : `${product.stock} unidades`}
                                        </span>
                                    </div>

                                    {/* Botones de acción Mobile táctiles */}
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <button 
                                            onClick={() => startEditMode(product)}
                                            className="inline-flex items-center justify-center gap-1.5 bg-nexus-bg hover:bg-nexus-border border border-nexus-border/60 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
                                        >
                                            <Edit3 size={14} className="text-amber-500" /> Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id, product.name)}
                                            className="inline-flex items-center justify-center gap-1.5 bg-nexus-bg hover:bg-red-500/10 border border-nexus-border/60 hover:border-red-500/30 py-2.5 rounded-xl text-xs font-bold text-red-400 transition-all cursor-pointer"
                                        >
                                            <Trash2 size={14} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 🖥️ MODO DESKTOP: Tabla unificada tradicional (Oculta en celulares) */}
                        <div className="hidden md:block overflow-hidden border border-nexus-border/60 bg-nexus-surface rounded-xl shadow-sm text-left">
                            <table className="w-full text-sm">
                                <thead className="bg-nexus-bg/40 text-nexus-text-muted text-xs uppercase tracking-wider font-bold border-b border-nexus-border/40">
                                    <tr>
                                        <th className="px-6 py-4">Producto</th>
                                        <th className="px-6 py-4">Categoría</th>
                                        <th className="px-6 py-4">Precio (ARS)</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-nexus-border/10 text-white font-medium">
                                    {displayProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-nexus-bg/20 transition-colors">
                                            <td className="px-6 py-3 flex items-center gap-3">
                                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-nexus-border/30" />
                                                <span className="truncate max-w-50 uppercase tracking-tight">{product.name}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-xs bg-nexus-bg border border-nexus-border/60 rounded-md px-2 py-1 text-nexus-text-muted">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-nexus-brand font-bold">
                                                {formatCurrency(product.price)}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`${product.stock === 0 ? 'text-red-400 font-bold' : product.stock <= 5 ? 'text-amber-400 font-bold' : 'text-nexus-text-main'}`}>
                                                    {product.stock === 0 ? 'Sin Stock' : `${product.stock} u.`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => startEditMode(product)}
                                                        className="p-2 bg-nexus-bg hover:bg-nexus-border border border-nexus-border/60 rounded-lg text-nexus-text-muted hover:text-white transition-all cursor-pointer"
                                                        title="Editar producto"
                                                    >
                                                        <Edit3 size={15} className="text-amber-500" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteProduct(product.id, product.name)}
                                                        className="p-2 bg-nexus-bg hover:bg-red-500/10 border border-nexus-border/60 hover:border-red-500/40 rounded-lg text-nexus-text-muted hover:text-red-400 transition-all cursor-pointer"
                                                        title="Eliminar producto"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}