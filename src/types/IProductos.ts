
//Opcion para ocupar el ENUM
export type Estado = 'DISPONIBLE'|'NODISPONIBLE';

// export interface IProductos{
//     nombre:String
//     descripcion:String
//     imagen:String
//     precio:Number
//     stock:Number
//     estado: Estado
// }

export interface IProductos {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    precio: number;
    stock: number;
    estado: string;
}
export interface IProductoCrear{
    nombre:String
    descripcion:String
    imagen:String
    precio:Number
    stock:Number
    idCategoria:Number
}


export interface IProductosMostrar{
    id:Number
    nombre:String
    descripcion:String
    imagen:String
    precio:Number
    stock:Number
    estado: Estado
}

