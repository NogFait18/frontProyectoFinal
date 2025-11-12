import { obtenerCategorias, obtenerProductos } from "../../../utils/api"
import type { ICategoria } from "../../../types/ICategoria";
import type { IProductos } from "../../../types/IProductos";

//Control de Stock de Categorias
const categoriasStock = document.getElementById('categoriasStock') as HTMLElement
const dataC:ICategoria[] = await obtenerCategorias()

const stockCategoria = dataC.length

categoriasStock.textContent = `${stockCategoria}`


//Control de Stock de Categorias
const productosStock = document.getElementById('productosStock') as HTMLElement
const dataP:IProductos[] = await obtenerProductos()

const stockProducto = dataP.length

productosStock.textContent = `${stockProducto}`


