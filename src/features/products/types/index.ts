export interface Product {
  id: string; // Mapea directo con tu columna text de Supabase
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isFavorite: boolean;
}