const btnAgregarCat = document.getElementById("btnAgregarCat") as HTMLButtonElement;
const cardContainer = document.getElementById("card_container") as HTMLElement | null;
import { crearCategoria } from "../../../utils/api";

btnAgregarCat.addEventListener("click", () => {
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.classList.add("modal_overlay");

  // Crear contenido del modal
  const modal = document.createElement("div");
  modal.classList.add("modal_content");

  modal.innerHTML = `
    <button class="modal_close">&times;</button>
    <h2 class="form_h2">Nueva Categoría</h2>
    <form id="formCategoria">
      <label for="name">Nombre:</label>
      <input type="text" name="name" id="name" class="form_input" required>

      <label for="desc">Descripción:</label>
      <input type="text" name="desc" id="desc" class="form_input description" required>

      <label for="url">URL de Imagen:</label>
      <input type="url" name="url" id="url" class="form_input" required>

      <button type="submit" class="form_button">Guardar</button>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Botón cerrar
  const btnClose = modal.querySelector(".modal_close") as HTMLButtonElement;
  btnClose.addEventListener("click", () => overlay.remove());

  // Cerrar al hacer clic fuera del modal
  overlay.addEventListener("click", (e: MouseEvent) => {
    if (e.target === overlay) overlay.remove();
  });

  // Capturar el formulario
  const form = modal.querySelector("#formCategoria") as HTMLFormElement;
  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(form);
    const nombre = formData.get("name") as string;
    const descripcion = formData.get("desc") as string;
    const url = formData.get("url") as string;
    const data = {
        nombre:nombre,
        descripcion:descripcion,
        imagen:url
    }

    crearCategoria(data)

    overlay.remove(); // cerrar modal

    
    if (!cardContainer) return;

    // 🔹 Crear un contenedor que incluye encabezado + datos
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

      <div class="categoria_row">
        <span></span>
        <img src="${url}" alt="${nombre}" class="categoria_img">
        <span>${nombre}</span>
        <p>${descripcion}</p>
        <div class="categoria_btn-container">
          <button class="adm_btn">Editar</button>
          <button class="adm_btn-peligro">Borrar</button>
        </div>
      </div>
    `;

    // Agregar el bloque al contenedor principal
    cardContainer.appendChild(cardGroup);
  });
});
