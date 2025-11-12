// import type { IProductos } from "./IProductos"

export interface ICategoria{
    nombre:String
    imagen:String
    descripcion:String
    // cambiar despues que no reciba un opcional
    //productos?: [IProductos]
}

export interface ICategoriaMostrar{
    id:Number
    nombre:String
    imagen:String
    descripcion:String
}