
const btnAgregarPro = document.getElementById("btnAgregarPro") as HTMLButtonElement;
const cardContainer = document.getElementById("card_containerPro") as HTMLElement | null;
import type { IProductosMostrar } from "../../../types/IProductos";
import { crearProducto, editarProductos, obtenerProductos } from "../../../utils/api";


// cargar categorias

const dataCategorias = await obtenerProductos();

dataCategorias.forEach((e : IProductosMostrar) => {
  const cardGroup = document.createElement("div");
    cardGroup.classList.add("categoria_group");

    cardGroup.innerHTML = `
      <div class="categorias_header">
            <span>ID</span>
            <span>Imagen</span>
            <span>Nombre</span>
            <span>Descripción</span>
            <span>precio</span>
            <span>stock</span>
            <span>estado</span>
            <span>Acción</span>
        </div>
        <div class="categoria_row">
        <span>${e.id}</span>
        <img src="${e.imagen}" alt="${e.nombre}" class="categoria_img">
        <span>${e.nombre}</span>
        <p>${e.descripcion}</p>
        <span>$${e.precio.toFixed(2)}</span>
        <span>${e.stock}</span>
        <span>${e.estado}</span>
        <div class="categoria_btn-container">
            <button class="adm_btn">Editar</button>
            <button class="adm_btn-peligro">Borrar</button>
        </div>
        </div>
        `;

    // Agregar el bloque al contenedor principal
    cardContainer?.appendChild(cardGroup);
  });
  

// Hasta aca llega la fx para renderizar las categorias


btnAgregarPro.addEventListener("click", () => {
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.classList.add("modal_overlay");

  // Crear contenido del modal
  const modal = document.createElement("div");
  modal.classList.add("modal_content");

  modal.innerHTML = `
    <button class="modal_close">&times;</button>
    <h2 class="form_h2">Editar Categoría</h2>
    <form id="formEditarCategoria">
      <label for="name">Nombre:</label>
      <input type="text" name="name" id="name" class="form_input"  required>

      <label for="desc">Descripción:</label>
      <input type="text" name="desc" id="desc" class="form_input description"  required>

      <label for="url">URL de Imagen:</label>
      <input type="url" name="url" id="url" class="form_input"  required>

      <label for="precio">Precio:</label>
      <input type="number" name="precio" id="precio" class="form_input"  step="0.01" required>

      <label for="stock">Stock:</label>
      <input type="number" name="stock" id="stock" class="form_input"  required>

      <label for="estado">Estado:</label>
      <select name="estado" id="estado" class="form_input" required>
        <option value="activo" "activo" ? "selected" : ""}>Activo</option>
        <option value="inactivo" "inactivo" ? "selected" : ""}>Inactivo</option>
      </select>

      <button type="submit" class="form_button">Guardar cambios</button>
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
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(form);
    const nombre = formData.get("name") as string;
    const descripcion = formData.get("desc") as string;
    const url = formData.get("url") as string;
    const precio = Number(formData.get("precio")); // ← declarar la variable
const stock = Number(formData.get("stock"));   // ← declarar la variable
const estado = formData.get("estado") ; // ← declarar la variable
    const data = {
      nombre: nombre,
      descripcion: descripcion,
      imagen: url,
      precio: precio,
      stock: stock,
      estado: estado
    };

    try {
      console.log("primer com entrando al try");

      await crearProducto(data);
      console.log("2do com despues de crear categoria");
    } catch (err) {
      console.log("Ocurrio un error al añadir una categoria " + err);
    }

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
            <span>precio</span>
            <span>stock</span>
            <span>estado</span>
            <span>Acción</span>
        </div>
        <div class="categoria_row">
        <span></span>
        <img src="${url}" alt="${nombre}" class="categoria_img">
        <span>${nombre}</span>
        <p>${descripcion}</p>
        <span>$${precio.toFixed(2)}</span>
        <span>${stock}</span>
        <span>${estado}</span>
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

document.addEventListener("click", (e) => {
  const btn = e.target as HTMLElement;
  if (btn.classList.contains("adm_btn")) {
    const categoriaRow = btn.closest(".categoria_row") as HTMLElement;
    if (!categoriaRow) return;

    // Obtener los datos actuales
    const id = categoriaRow.dataset.id; // o desde tu backend
    const nombre = categoriaRow.querySelector("span:nth-child(3)")?.textContent || "";
    const descripcion = categoriaRow.querySelector("p")?.textContent || "";
    const imagen = (categoriaRow.querySelector("img") as HTMLImageElement)?.src || "";
    const precioText = categoriaRow.querySelector("span:nth-child(5)")?.textContent || "0";
    const precio = Number(precioText.replace("$", "")); // quita el signo $ y convierte a número
    const stock = Number(categoriaRow.querySelector("span:nth-child(6)")?.textContent || "0");
    const estado = categoriaRow.querySelector("span:nth-child(7)")?.textContent || "inactivo";

    abrirModalEditar(id!, nombre, descripcion, imagen,precio,stock,estado, categoriaRow);
  }
});

const abrirModalEditar = (
  id: string,
  nombreActual: string,
  descripcionActual: string,
  imagenActual: string,
  precioActual: number,
  stockActual: number,
  estadoActual: string, // o tu tipo Estado
  categoriaRow: HTMLElement
) => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal_overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal_content");

  modal.innerHTML = `
    <button class="modal_close">&times;</button>
    <h2 class="form_h2">Editar Categoría</h2>
    <form id="formEditarCategoria">
      <label for="name">Nombre:</label>
      <input type="text" name="name" id="name" class="form_input" value="${nombreActual}" required>

      <label for="desc">Descripción:</label>
      <input type="text" name="desc" id="desc" class="form_input description" value="${descripcionActual}" required>

      <label for="url">URL de Imagen:</label>
      <input type="url" name="url" id="url" class="form_input" value="${imagenActual}" required>

      <label for="precio">Precio:</label>
      <input type="number" name="precio" id="precio" class="form_input" value="${precioActual}" step="0.01" required>

      <label for="stock">Stock:</label>
      <input type="number" name="stock" id="stock" class="form_input" value="${stockActual}" required>

      <label for="estado">Estado:</label>
      <select name="estado" id="estado" class="form_input" required>
        <option value="activo" ${estadoActual === "activo" ? "selected" : ""}>Activo</option>
        <option value="inactivo" ${estadoActual === "inactivo" ? "selected" : ""}>Inactivo</option>
      </select>

      <button type="submit" class="form_button">Guardar cambios</button>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const btnClose = modal.querySelector(".modal_close") as HTMLButtonElement;
  btnClose.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e: MouseEvent) => {
    if (e.target === overlay) overlay.remove();
  });

  const form = modal.querySelector("#formEditarCategoria") as HTMLFormElement;
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      nombre: formData.get("name") as string,
      descripcion: formData.get("desc") as string,
      imagen: formData.get("url") as string,
    };

    try {
      await editarProductos(Number(id), data);

      // Actualizar en el DOM
      (categoriaRow.querySelector("span:nth-child(3)") as HTMLElement).textContent = data.nombre;
      (categoriaRow.querySelector("p") as HTMLElement).textContent = data.descripcion;
      (categoriaRow.querySelector("img") as HTMLImageElement).src = data.imagen;

      console.log("Categoría actualizada correctamente");
    } catch (error) {
      console.error("Error al editar categoría:", error);
    }

    overlay.remove();
  });
};
