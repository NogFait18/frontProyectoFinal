import { cambiarEstadoPedido, mostrarPedidos, mostrarPedidosPorEstado, traerUsuarioPorId } from "../../../utils/api";

// =====================
// ELEMENTOS DEL DOM
// =====================
const pedidos = document.getElementById("card_containerPed");
const filtroSelect = document.getElementById("filtroPedidos") as HTMLSelectElement;

const modal = document.getElementById("modalEditar")!;
const pedidoIdLabel = document.getElementById("modal-pedido-id")!;
const selectEstado = document.getElementById("select-estado") as HTMLSelectElement;
const btnCerrar = document.getElementById("cerrar-modal")!;
const btnGuardar = document.getElementById("guardar-estado")!;

// =====================
// FUNCIONES
// =====================

// Renderizar pedidos
async function renderizarPedidos(pedidosMostrar: any[]) {
  pedidos!.innerHTML = ""; // Limpia el contenedor

  if (!pedidosMostrar || pedidosMostrar.length === 0) {
    const sinPedidos = document.createElement("p");
    sinPedidos.textContent = "No hay pedidos con ese estado.";
    sinPedidos.style.textAlign = "center";
    sinPedidos.style.fontWeight = "bold";
    pedidos?.appendChild(sinPedidos);
    return;
  }

  // Crear cada card
  for (const p of pedidosMostrar) {
    const usuario = await traerUsuarioPorId(p.idCliente || p.id);

    const div = document.createElement("div");
    div.classList.add("pedido-card", `pedido-${p.estado.toLowerCase()}`);

    div.innerHTML = `
      <div class="pedido-header">
        <h4>Pedido #${p.id}</h4>
        <span class="estado">${p.estado}</span>
      </div>
      <div class="pedido-body">
        <p><strong>Cliente:</strong> ${usuario.nombre} ${usuario.apellido}</p>
        <p><strong>Fecha:</strong> ${p.fecha}</p>
        <p><strong>Productos:</strong> ${p.detalles.length}</p>
        <p><strong>Total:</strong> $${p.total}</p>
        <button class="editar-btn">Editar</button>
      </div>
    `;

    pedidos?.appendChild(div);
  }

  // ➤ Ahora que los botones existen, asignamos eventos
  const editarBtns = document.querySelectorAll(".editar-btn");
  editarBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      abrirModal(pedidosMostrar[index]);
    });
  });
}

// Cargar todos los pedidos
async function cargarPedidos() {
  pedidos!.innerHTML = "<p>Cargando pedidos...</p>";

  try {
    const pedidosMostrar = await mostrarPedidos();
    await renderizarPedidos(pedidosMostrar);
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
  }
}

// Cargar pedidos según estado
async function cargarPedidosPorEstado(estado: string) {
  pedidos!.innerHTML = "<p>Cargando pedidos...</p>";

  try {
    if (estado === "TODOS") {
      await cargarPedidos();
      return;
    }

    const pedidosMostrar = await mostrarPedidosPorEstado(estado);
    await renderizarPedidos(pedidosMostrar);
  } catch (error) {
    console.error(`Error al cargar pedidos con estado ${estado}:`, error);
  }
}

// Abrir modal
function abrirModal(pedido: any) {
  pedidoIdLabel.textContent = `Pedido #${pedido.id}`;
  selectEstado.value = pedido.estado;
  modal.dataset.pedidoId = pedido.id;
  modal.classList.remove("hidden");
}

// =====================
// EVENTOS DEL MODAL
// =====================

btnCerrar.addEventListener("click", () => {
  modal.classList.add("hidden");
});

btnGuardar.addEventListener("click", async () => {
  const id = Number(modal.dataset.pedidoId);
  const nuevoEstado = selectEstado.value;

  try {
    await cambiarEstadoPedido(id, nuevoEstado);
    modal.classList.add("hidden");
    cargarPedidos(); // refrescar
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    alert("No se pudo actualizar el estado.");
  }
});

// =====================
// EVENTO DEL FILTRO
// =====================
filtroSelect?.addEventListener("change", () => {
  cargarPedidosPorEstado(filtroSelect.value);
});

// =====================
// CARGA INICIAL
// =====================
cargarPedidos();
