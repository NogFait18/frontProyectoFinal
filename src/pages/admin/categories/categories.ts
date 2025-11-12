import type { ICategoria, ICategoriaMostrar } from '../../../types/ICategoria';
import { crearCategoria } from "../../../utils/api";
import { obtenerCategorias } from "../../../utils/api";
import { editarCategoria } from "../../../utils/api";
import { eliminarCategoria } from "../../../utils/api";


// -------------------------------------- SELECTORES -----------------------------------------------------------------------

// selector : boton para agregar categoria
const btnAgregarCat = document.getElementById(
  "btnAgregarCat"
) as HTMLButtonElement;

// selector : contenedor de las cards
const cardContainer = document.getElementById(
  "card_container"
) as HTMLElement | null;




// -------------------------------------- FUNCIONES DE APOYO -----------------------------------------------------------------------
// si no las ponia arriba de la logica no las carga por el hoisting, no queria usar function, y queria mantener funciones flecha

// Funcion para renderizar las cards en el dom

const renderizarCategoria = (categoria: ICategoriaMostrar): void => {
  if (!cardContainer) return;
  
  const cardGroup = document.createElement("div");
  cardGroup.classList.add("categoria_group");
  
  cardGroup.innerHTML = `
  <div class="categorias_header">
  <span>ID</span>
  <span>Imagen</span>
  <span>Nombre</span>
  <span>Descripción</span>
  <span>Acción</span>
  </div>
  
  <div class="categoria_row" data-id="${categoria.id}">
  <span>${categoria.id}</span>
  <img src="${categoria.imagen}" alt="${categoria.nombre}" class="categoria_img">
  <span>${categoria.nombre}</span>
  <p>${categoria.descripcion}</p>
  <div class="categoria_btn-container">
  <button class="adm_btn">Editar</button>
  <button class="adm_btn-peligro">Borrar</button>
  </div>
  </div>
  `;
  
  cardContainer.appendChild(cardGroup);
  
  // selector de boton para editar cat
  const btnEditarCat = cardGroup.querySelector(".adm_btn") as HTMLButtonElement;
  btnEditarCat.addEventListener("click", ()=>{
    abrirModalCategoria("editar", categoria);
  });

  // selector de boton para eliminar cat
  const btnEliminarCat = cardGroup.querySelector(".adm_btn-peligro") as HTMLButtonElement;
  btnEliminarCat.addEventListener("click", async ()=>{
    const confirmarEliminar = confirm(`Esta seguro que desea eliminar esta categoria? ${categoria.nombre}`);
    if(!confirmarEliminar) return;

    try{
      await eliminarCategoria(Number(categoria.id));
      console.log("Categoria eliminada correctamente");
      cardGroup.remove();
      
    } catch(err){
      console.error("Error al eliminar la categoria: ", err);
      
    }
  })

};


// --------------  modal reutilizable para editar o crear  --------------
// a este modal lo podemos usar para crear o para editar la categoria sin repetir codigo y que quede mas prolijo
// le pasamos como parametro al momento de hacer click sobre los botones si es "crear" o "editar" y dependiendo el valor muestra
// una cosa o la otra en el modal

const abrirModalCategoria = ( modo: "crear" | "editar", categoria?: ICategoriaMostrar): void =>{
  
  // Crear overlay del fondo mas oscuro
  const overlay = document.createElement("div");
  overlay.classList.add("modal_overlay");
  
  // Crear contenido del modal
  const modal = document.createElement("div");
  modal.classList.add("modal_content");
  
  // Contenido dinámico
  modal.innerHTML = `
  <button class="modal_close">&times;</button>
  <h2 class="form_h2">${
    modo === "crear" ? "Nueva Categoría" : "Editar Categoría"
  }</h2>
  
  <form id="formCategoria">
  <label for="name">Nombre:</label>
  <input 
  type="text" 
  name="name" 
  id="name" 
  class="form_input" 
  value="${categoria?.nombre ?? ""}" 
  required
  >
  
  <label for="desc">Descripción:</label>
  <input 
  type="text" 
  name="desc" 
  id="desc" 
  class="form_input description" 
  value="${categoria?.descripcion ?? ""}" 
  required
  >
  
  <label for="url">URL de Imagen:</label>
  <input 
  type="url" 
  name="url" 
  id="url" 
  class="form_input" 
  value="${categoria?.imagen ?? ""}" 
  required
  >
  
  <button type="submit" class="form_button">
  ${modo === "crear" ? "Guardar" : "Guardar Cambios"}
  </button>
  </form>
  `;
  
  // Insertar el modal en el dom
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Botones para cerrar el modal
  const btnClose = modal.querySelector(".modal_close") as HTMLButtonElement;
  btnClose.addEventListener("click", () => overlay.remove());
  
  overlay.addEventListener("click", (e: MouseEvent) => {
    if (e.target === overlay) overlay.remove();
  });
  
  // Ahora manejamos el formulario del modal
  const form = modal.querySelector("#formCategoria") as HTMLFormElement;
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    
    // instanciamos un tipo FormData y le pasamos nuestro form capturado, para usar metodos de FormData
    const formData = new FormData(form);
    const data: ICategoria = {
      nombre: formData.get("name") as string,
      descripcion: formData.get("desc") as string,
      imagen: formData.get("url") as string,
    };
    
    try {
      if (modo === "crear") {
        await crearCategoria(data);
        console.log("✅ Categoria creada con exito");
      } else if (modo === "editar" && categoria?.id) {
        await editarCategoria(Number(categoria.id), data);
        console.log("✅ Categoria editada con exito");
      }
      
      overlay.remove();
      location.reload(); // o podés actualizar manualmente el DOM si preferís
    } catch (err) {
      console.error("❌ Error al guardar la categoria:", err);
    }
  });
}



// -------------------------------------- LOGICA -----------------------------------------------------------------------


// cargar categorias
const dataCategorias = await obtenerCategorias();

dataCategorias.forEach((categoria: ICategoriaMostrar)=>{
  renderizarCategoria(categoria);
})
  


// crear una categoria
btnAgregarCat.addEventListener("click", ()=>{
  abrirModalCategoria("crear");
});


