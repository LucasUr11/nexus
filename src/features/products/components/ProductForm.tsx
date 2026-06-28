import { useState, useEffect } from "react";
import { PlusCircle, Edit3, X } from 'lucide-react';
import { type Product, type CategoryType } from "../types";

interface ProductFromProps {
    onAddProduct: (product: Product) => void;
    productToEdit?: Product | null;
    onCancel?: () => void;
}

const CATEGORIES: CategoryType[] = ['Teclados', 'Mouse', 'Audio', 'Mousepads', 'Componentes', 'Accesorios'];

export const ProductForm = ({ onAddProduct, productToEdit, onCancel }: ProductFromProps) => {
    const isEditing = !!productToEdit;

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState<CategoryType>('Teclados');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setBrand(productToEdit.brand || '');
            setDescription(productToEdit.description);
            setPrice(productToEdit.price.toString());
            setImageUrl(productToEdit.imageUrl);
            setCategory(productToEdit.category);
            setStock(productToEdit.stock.toString());
        } else {
            setName('');
            setBrand('');
            setDescription('');
            setPrice('');
            setImageUrl('');
            setCategory('Teclados');
            setStock('');
        }
    }, [productToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !brand || !description || !price || !imageUrl || !stock || !category) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Crea un unico objeto respetando si es edicion o creacion.-
        const productData: Product = {
            // Si edita, hereda estrictamente el ID del objeto a editar
            id: isEditing && productToEdit ? productToEdit.id : `prod-${Date.now()}`,
            name,
            brand,
            description,
            price: parseFloat(price),
            imageUrl,
            category,
            stock: parseInt(stock, 10),
            isFavorite: productToEdit?.isFavorite || false,

            // Viajaran vacios hasta la implementacion en el checkout.-
            specifications: productToEdit?.specifications || {},
            variants: productToEdit?.variants || []
        };

        onAddProduct(productData);

        if (!isEditing) {
            setName('');
            setBrand('');
            setDescription('');
            setPrice('');
            setImageUrl('');
            setCategory('Teclados');
            setStock('');
        }
    };

    return (
        <section id="product-form-section" className="bg-nexus-surface border border-nexus-border/60 p-6 rounded-2xl shadow-sm text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-nexus-border/20 pb-3 mb-5">
                <div className="flex items-center gap-2">
                    {isEditing ? <Edit3 size={18} className="text-amber-500" /> : <PlusCircle size={18} className="text-nexus-brand" />}
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        {isEditing ? `Editando: ${productToEdit?.name}` : 'Añadir nuevo producto'}
                    </h3>
                </div>
                {isEditing && onCancel && (
                    <button onClick={onCancel} className="inline-flex items-center gap-1 text-[11px] font-bold uppercase bg-nexus-bg border border-nexus-border/60 px-2.5 py-1 rounded-lg text-nexus-text-muted hover:text-red-400 transition-all cursor-pointer">
                        <X size={12} /> Cancelar edición
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Nombre y Marca.-*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-nexus-text-muted uppercase">Nombre del Producto</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-nexus-brand" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-nexus-text-muted uppercase">Marca (Ej: Redragon, Logitech)</label>
                        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-nexus-brand" />
                    </div>
                </div>

                {/* Descripción.- */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-nexus-text-muted uppercase">Descripción Corta</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-nexus-brand" />
                </div>

                {/* Precio, stock y categoria.- */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Precio.- */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-nexus-text-muted uppercase">Precio (ARS)</label>
                        <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-nexus-brand" />
                    </div>

                    {/* Stock.- */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-nexus-text-muted uppercase">Stock Global</label>
                        <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-nexus-brand" />
                    </div>

                    {/* Categoria.- */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-nexus-text-muted uppercase">Categoría</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value as CategoryType)} className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-nexus-brand cursor-pointer">
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* URL de la imagen.- */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-nexus-text-muted uppercase">URL de la Imagen</label>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-nexus-brand" />
                </div>

                {/* Boton de enviar.- */}
                <button type="submit" className={`mt-2 w-full text-white text-sm font-bold uppercase py-3 rounded-xl shadow-sm transition-all cursor-pointer ${isEditing ? 'bg-amber-600 hover:bg-amber-500' : 'bg-nexus-brand hover:bg-nexus-brand-hover'}`}>
                    {isEditing ? 'Actualizar Cambios en la Nube' : 'Guardar Producto'}
                </button>
            </form>
        </section>
    );
}