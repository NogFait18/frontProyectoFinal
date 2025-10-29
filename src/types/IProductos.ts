//Opcion para ocupar el ENUM
export type Estado = 'DISPONIBLE'|'NODISPONIBLE';

export interface IProductos{
    nombre:String
    descripcion:String
    imagen:String
    precio:Number
    stock:Number
    estado: Estado
}

