//Opcion para ocupar el ENUM
export type EstadoPedido = 'DISPONIBLE'|'NODISPONIBLE';

export interface IPedidos{
    nombre:String
    descripcion:String
    imagen:String
    precio:Number
    stock:Number
    estado: EstadoPedido
}


export interface IPediodoMostrar{
    id:Number
    fecha:String
    estado: EstadoPedido
    stock: Number
    detalles:[]
    total:Number
}

