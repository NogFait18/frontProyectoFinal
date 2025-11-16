
// importacion de 
import type { ICartItem } from '../types/ICart'; 

// La "llave" se define y exporta AQUÍ
export const nombreCarrito = 'carrito';

/**
 * Obtiene el carrito actual desde localStorage.
 */
export function getCart(): ICartItem[] {
  const cartJson = localStorage.getItem(nombreCarrito);
  return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * Guarda el carrito en localStorage.
 */
export function saveCart(cart: ICartItem[]): void {
  localStorage.setItem(nombreCarrito, JSON.stringify(cart));
}

/**
 * Limpia el carrito de localStorage.
 */
export function clearCart(): void {
  localStorage.removeItem(nombreCarrito);
}





