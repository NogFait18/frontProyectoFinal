import { mostrarPedidos, obtenerCategorias, obtenerProductos } from "../../../utils/api"
import type { ICategoria } from "../../../types/ICategoria";
import type { IProductos } from "../../../types/IProductos";
import type { IPedidos } from "../../../types/IPedido";

//Control de Stock de Categorias
const categoriasStock = document.getElementById('categoriasStock') as HTMLElement
const dataC:ICategoria[] = await obtenerCategorias()

const stockCategoria = dataC.length

categoriasStock.textContent = `${stockCategoria}`


//Control de Stock de Productos
const productosStock = document.getElementById('productosStock') as HTMLElement
const dataP:IProductos[] = await obtenerProductos()

const stockProducto = dataP.length

productosStock.textContent = `${stockProducto}`


//Control de Stock de Pedidos
const pedidosStock = document.getElementById('pedidosStock') as HTMLElement
const dataPed:IPedidos[] = await mostrarPedidos()


const stockPedido = dataPed.length

pedidosStock.textContent = `${stockPedido}`


// Control de Stock de Productos (solo los que tienen stock > 0)
const productosConStock = document.getElementById('productosConStock') as HTMLElement;
const dataProductDisponibles: IProductos[] = await obtenerProductos();

// Filtrar solo los productos disponibles
const productosConStockDisponible = dataProductDisponibles.filter(p => 
    p.stock > 0 && p.estado === "DISPONIBLE"
);

// Cantidad de productos con stock > 0
const stockConProducto = productosConStockDisponible.length;

// Mostrar el valor en el HTML
productosConStock.textContent = `${stockConProducto}`;





