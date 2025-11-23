import type { PageLoad } from "./$types";
import { fetchProductById } from "$lib/gateways/products";
import type { Product } from "$lib/types/product";


export const load: PageLoad = async ({params, fetch}) =>{
    const product_id = params.id;
    const product: Product = await fetchProductById(fetch, product_id);

    return {product};
}