import type { IProductos } from "./IProductos";

export interface ICartParaPedido {
  cantidad: number;
  productoId: number;
}

export interface ICartItem extends IProductos{
  cantidad: number
}

