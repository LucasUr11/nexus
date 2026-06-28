// Centralizar las categorias comerciales reales.-
export type CategoryType = 'Teclados' | 'Mouse' | 'Audio' | 'Mousepads' | 'Componentes' | 'Accesorios';

// Estructura para variantes de producto (mousepad).-
export interface ProductVariant {
  id: string;
  attributeName: string; // Ejemplo: Tamaño o color.-
  attributeValue: string; // Ejemplo: XL (900x400mm), Negro.-
  stock: number;
  priceOffset?: number; // Opcional, por si el XL sale mas caro que el S.-
}

// Interfaz del Producto Global y Escalable.-
export interface Product {
  id: string;
  name: string;
  brand: string; // Clave para el nicho de hardware.-
  description: string;
  price: number;
  imageUrl: string;
  category: CategoryType; // Usa el tipo estricto.-
  stock: number;
  isFavorite: boolean;

  // Atributos dinamicos.-
  specifications?: {
    [jey: string]: string; // Ejemplo: Superficie, Control, Conectividad, etc.-
  };
  variants?: ProductVariant[]; // Lista de variantes del producto, si las tuviera.-
}