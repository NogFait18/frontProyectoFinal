import type { IProductos } from "./IProductos"

export interface ICategoria{
    nombre:String
    imagen:String
    descripcion:String
    productos?: [IProductos]
}