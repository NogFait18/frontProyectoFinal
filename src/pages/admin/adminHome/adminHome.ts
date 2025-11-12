import { obtenerCategorias } from "../../../utils/api"
import type { ICategoria } from "../../../types/ICategoria";

const categoriasStock = document.getElementById('categoriasStock') as HTMLElement
const data:ICategoria[] = await obtenerCategorias()

const stockCategoria = data.length

categoriasStock.textContent = `${stockCategoria}`

