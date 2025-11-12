const btnAgregarPro = document.getElementById("btnAgregarPro") as HTMLButtonElement;
const cardContainer = document.getElementById("card_containerPro") as HTMLElement | null;
import type { IProductosMostrar } from "../../../types/IProductos";
import { crearProducto, editarProductos, eliminarProducto, obtenerProductos } from "../../../utils/api";

const dataProductos = await obtenerProductos();

dataProductos.forEach((e: IProductosMostrar) => {
  const cardGroup = document.createElement("div");
  cardGroup.classList.add("producto_group");

  cardGroup.innerHTML = `
    <div class="productos_header">
      <span>ID</span>
      <span>Imagen</span>
      <span>Nombre</span>
      <span>Descripción</span>
      <span>Precio</span>
      <span>Stock</span>
      <span>Estado</span>
      <span>Acción</span>
    </div>
    <div class="producto_row" data-id="${e.id}">
      <span>${e.id}</span>
      <img src="${e.imagen}" alt="${e.nombre}" class="producto_img">
      <span>${e.nombre}</span>
      <p>${e.descripcion}</p>
      <span>$${e.precio.toFixed(2)}</span>
      <span>${e.stock}</span>
      <span>${e.estado}</span>
      <div class="producto_btn-container">
        <button class="adm_btn">Editar</button>
        <button class="adm_btn-peligro">Borrar</button>
      </div>
    </div>
  `;

  cardContainer?.appendChild(cardGroup);
  document.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;

  // Verificamos si clickeó en un botón "Borrar"
  if (target.classList.contains("adm_btn-peligro")) {
    const productoRow = target.closest(".producto_row") as HTMLElement;
    if (!productoRow) return;

    const id = productoRow.dataset.id;
    const nombre = productoRow.querySelector("span:nth-child(3)")?.textContent || "";

    const confirmar = confirm(`¿Seguro que desea eliminar el producto "${nombre}"?`);
    if (!confirmar) return;

    try {
      await eliminarProducto(Number(id));
      productoRow.parentElement?.remove(); // elimina la card entera
      console.log(`Producto "${nombre}" eliminado correctamente`);
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
    }
  }
});

});

btnAgregarPro.addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal_overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal_content");

  modal.innerHTML = `
    <button class="modal_close">&times;</button>
    <form id="formProducto">
      <label for="name">Nombre:</label>
      <input type="text" name="name" id="name" class="form_input" required>

      <label for="desc">Descripción:</label>
      <input type="text" name="desc" id="desc" class="form_input description" required>

      <label for="url">URL de Imagen:</label>
      <input type="url" name="url" id="url" class="form_input" required>

      <label for="precio">Precio:</label>
      <input type="number" name="precio" id="precio" class="form_input" step="0.01" required>

      <label for="stock">Stock:</label>
      <input type="number" name="stock" id="stock" class="form_input" required>

      <label for="estado">Estado:</label>
      <select name="estado" id="estado" class="form_input" required>
        <option value="DISPONIBLE">DISPONIBLE</option>
        <option value="NODISPONIBLE">NODISPONIBLE</option>
      </select>

      <button type="submit" class="form_button">Guardar</button>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const btnClose = modal.querySelector(".modal_close") as HTMLButtonElement;
  btnClose.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e: MouseEvent) => {
    if (e.target === overlay) overlay.remove();
  });

  const form = modal.querySelector("#formProducto") as HTMLFormElement;
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      nombre: formData.get("name") as string,
      descripcion: formData.get("desc") as string,
      imagen: formData.get("url") as string,
      precio: Number(formData.get("precio")),
      stock: Number(formData.get("stock")),
      estado: formData.get("estado"),
    };

    try {
      await crearProducto(data);
    } catch (err) {
      console.log("Error al crear producto: " + err);
    }

    overlay.remove();

    const cardGroup = document.createElement("div");
    cardGroup.classList.add("producto_group");

    cardGroup.innerHTML = `
      <div class="productos_header">
        <span>ID</span>
        <span>Imagen</span>
        <span>Nombre</span>
        <span>Descripción</span>
        <span>Precio</span>
        <span>Stock</span>
        <span>Estado</span>
        <span>Acción</span>
      </div>
      <div class="producto_row">
        <span></span>
        <img src="${data.imagen}" alt="${data.nombre}" class="producto_img">
        <span>${data.nombre}</span>
        <p>${data.descripcion}</p>
        <span>$${data.precio.toFixed(2)}</span>
        <span>${data.stock}</span>
        <span>${data.estado}</span>
        <div class="producto_btn-container">
          <button class="adm_btn">Editar</button>
          <button class="adm_btn-peligro">Borrar</button>
        </div>
      </div>
    `;

    cardContainer?.appendChild(cardGroup);
  });
});

document.addEventListener("click", (e) => {
  const btn = e.target as HTMLElement;
  if (btn.classList.contains("adm_btn")) {
    const productoRow = btn.closest(".producto_row") as HTMLElement;
    if (!productoRow) return;

    const id = productoRow.dataset.id;
    const nombre = productoRow.querySelector("span:nth-child(3)")?.textContent || "";
    const descripcion = productoRow.querySelector("p")?.textContent || "";
    const imagen = (productoRow.querySelector("img") as HTMLImageElement)?.src || "";
    const precioText = productoRow.querySelector("span:nth-child(5)")?.textContent || "0";
    const precio = Number(precioText.replace("$", ""));
    const stock = Number(productoRow.querySelector("span:nth-child(6)")?.textContent || "0");
    const estado = productoRow.querySelector("span:nth-child(7)")?.textContent || "inactivo";

    abrirModalEditar(id!, nombre, descripcion, imagen, precio, stock, estado, productoRow);
  }
});

const abrirModalEditar = (
  id: string,
  nombreActual: string,
  descripcionActual: string,
  imagenActual: string,
  precioActual: number,
  stockActual: number,
  estadoActual: string,
  productoRow: HTMLElement
) => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal_overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal_content");

  modal.innerHTML = `
    <button class="modal_close">&times;</button>
    <form id="formEditarProducto">
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
        <option value="DISPONIBLE" ${estadoActual === "DISPONIBLE" ? "selected" : ""}>DISPONIBLE</option>
        <option value="NODISPONIBLE" ${estadoActual === "DISPONIBLE" ? "selected" : ""}>NODISPONIBLE</option>
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

  const form = modal.querySelector("#formEditarProducto") as HTMLFormElement;
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      nombre: formData.get("name") as string,
      descripcion: formData.get("desc") as string,
      imagen: formData.get("url") as string,
      precio: Number(formData.get("precio")),
      stock: Number(formData.get("stock")),
      estado: formData.get("estado"),
    };

    try {
      await editarProductos(Number(id), data);
      (productoRow.querySelector("span:nth-child(3)") as HTMLElement).textContent = data.nombre;
      (productoRow.querySelector("p") as HTMLElement).textContent = data.descripcion;
      (productoRow.querySelector("img") as HTMLImageElement).src = data.imagen;
      (productoRow.querySelector("span:nth-child(5)") as HTMLElement).textContent = `$${data.precio.toFixed(2)}`;
      (productoRow.querySelector("span:nth-child(6)") as HTMLElement).textContent = String(data.stock);
      (productoRow.querySelector("span:nth-child(7)") as HTMLElement).textContent = String(data.estado);
      console.log("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al editar producto:", error);
    }

    overlay.remove();
  });
};
