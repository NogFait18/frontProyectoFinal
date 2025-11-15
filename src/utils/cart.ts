
// (Ajusta esta ruta si es necesario)
import type { ICartItem } from '../types/ICart'; 

// La "llave" se define y exporta AQUÍ
export const CART_STORAGE_KEY = 'foodStoreCart';

/**
 * Obtiene el carrito actual desde localStorage.
 */
export function getCart(): ICartItem[] {
  const cartJson = localStorage.getItem(CART_STORAGE_KEY);
  return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * Guarda el carrito en localStorage.
 */
export function saveCart(cart: ICartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Limpia el carrito de localStorage.
 */
export function clearCart(): void {
  localStorage.removeItem(CART_STORAGE_KEY);
}





