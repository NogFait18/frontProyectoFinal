import { obtenerCategorias } from "../../utils/api";
import type { ICategoriaMostrar } from "../../types/ICategoria";


// ------------------- SELECTORES -------------------
const categoriaPanel = document.getElementById("categoriasPanel") as HTMLElement | null;


// ------------------- LOGICA -------------------

const cargarCategorias = async (): Promise<void> => {

    try{
        const categorias = await obtenerCategorias();
        if (!categoriaPanel) return;
        categoriaPanel.innerHTML = `
        <section class="panelControl">
        <button class="categoria_btn-filtro" id="btnVerTodo">🍽️ Ver todo</button>
        </section>`;

        categorias.forEach((cat: ICategoriaMostrar) => {
            const sectionNuevaCat = document.createElement("section");
            sectionNuevaCat.classList.add("panelControl");

            sectionNuevaCat.innerHTML= `
        <button class="categoria_btn-filtro" data-id="${cat.id}">
        ${cat.nombre}
        </button>`;

        categoriaPanel.appendChild(sectionNuevaCat);
        })


    } catch (err) {
        console.error("Se produjo un error al listar las categorias: ", err);
        
    }
};

cargarCategorias();




