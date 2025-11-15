// /src/types/ICart.ts

// 1. Importa la interfaz base de tu producto
import type { IProductos } from './IProductos';

// 2. EXPORTA la nueva interfaz para el carrito
export interface ICartItem extends IProductos {
  cantidad: number;
}