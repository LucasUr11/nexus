import { type Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
    return (
        <section className="w-full">

            {/* Grilla responsiva adaptada a móviles, tablets y monitores grandes */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

        </section>
    );
};