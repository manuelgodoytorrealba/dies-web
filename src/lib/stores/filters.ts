import { writable } from 'svelte/store';

export type OrderBy =
  | 'none'
  | 'price-asc'
  | 'price-desc'
  | 'newest';

export type FiltersState = {
  query: string;
  category: string; // zapatillas | ropa | accesorios
  brand: string;
  size: string;
  orderBy: OrderBy;
  priceMin: number | null;
  priceMax: number | null;
};

export const filtersStore = writable<FiltersState>({
  query: '',
  category: 'zapatillas',
  brand: '',
  size: '',
  orderBy: 'none',
  priceMin: null,
  priceMax: null
});

export const setQuery = (query: string) =>
  filtersStore.update((f) => ({ ...f, query }));

export const setCategory = (category: string) =>
  filtersStore.update((f) => ({ ...f, category, brand: '', size: '' }));

export const setBrand = (brand: string) =>
  filtersStore.update((f) => ({ ...f, brand }));

export const setSize = (size: string) =>
  filtersStore.update((f) => ({ ...f, size }));

export const setOrderBy = (orderBy: OrderBy) =>
  filtersStore.update((f) => ({ ...f, orderBy }));

export const setPriceRange = (min: number | null, max: number | null) =>
  filtersStore.update((f) => ({ ...f, priceMin: min, priceMax: max }));

export const resetFilters = () =>
  filtersStore.set({
    query: '',
    category: 'zapatillas',
    brand: '',
    size: '',
    orderBy: 'none',
    priceMin: null,
    priceMax: null
  });