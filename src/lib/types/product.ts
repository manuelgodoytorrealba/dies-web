// src/lib/types/product.ts

export type ProductStatus = 'disponible' | 'reservado' | 'vendido' | string;

export interface Product {
  product_id: string;          // UUID
  slug: string;

  nombre: string;
  descripcion: string | null;

  marca: string;
  imagen_url: string | null;

  talla: number | string | null;

  precio_publicado: number;    // decimal en DB -> number en TS
  stock: number;

  status_producto: ProductStatus;

  created_at: string;          // timestamp ISO
  status_updated_at: string;   // timestamp ISO

  published: boolean;
}