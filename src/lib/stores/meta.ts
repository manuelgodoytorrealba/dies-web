// src/lib/stores/meta.ts
import { writable } from 'svelte/store';
import type { ProductsMeta } from '$lib/gateways/meta';

export const metaStore = writable<ProductsMeta>({
  brands: [],
  sizes: [],
  priceRange: { min: 0, max: 0 },
  categories: ['zapatillas', 'ropa', 'accesorios']
});