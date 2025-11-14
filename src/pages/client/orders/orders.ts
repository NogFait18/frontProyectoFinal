import { mostrarPedidosCliente, mostrarPedidos, mostrarPedidosPorEstadoCliente, traerUsuarioPorId } from "../../../utils/api";

const pedidos = document.getElementById("card_containerPed");
const filtroSelect = document.getElementById("filtroPedidos") as HTMLSelectElement;

// Función para renderizar pedidos o mostrar un mensaje si no hay resultados
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
console.log(pedidosMostrar)
  for (const p of pedidosMostrar) {

  const div = document.createElement("div");
  div.classList.add("pedido-card");

  // clase según estado
  div.classList.add(`pedido-${p.estado.toLowerCase()}`); 

    let items = 0
    for( const det of p.detalles){
        items += det.cantidad
    }

  div.innerHTML = `
    <div class="pedido-header">
      <h4>Pedido #${p.id}</h4>
      <span class="estado">${p.estado}</span>
    </div>
    <div class="pedido-body">
      <p><strong>Fecha:</strong> ${p.fecha}</p>
      <p><strong>+</strong> ${p.detalles[0].productoDto.nombre} (x${p.detalles[0].cantidad})</p>
      <p><strong>+</strong> ${p.detalles[1].productoDto.nombre} (x${p.detalles[1].cantidad})</p>
      <p><strong>Productos:</strong> ${items}</p>
      <p><strong>Total:</strong> $${p.total}</p>
    </div>
  `;
  pedidos?.appendChild(div);
}
//numero de pedido, fecha, estado
// detALLE DE DOS PRODUCTOS, total de productos y precio total
}

// Cargar todos los pedidos
async function cargarPedidos() {
  pedidos!.innerHTML = "<p>Cargando pedidos...</p>";

  try {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario")!);
    const email = usuarioLocal.email;

    const pedidosMostrar = await mostrarPedidosCliente(email);

    await renderizarPedidos(pedidosMostrar);

  } catch (error) {
    console.error("Error al cargar pedidos:", error);
  }
}

// Cargar pedidos filtrados por estado
async function cargarPedidosPorEstado(estado: string) {
  pedidos!.innerHTML = "<p>Cargando pedidos...</p>";
  try {
    if (estado === "TODOS") {
      await cargarPedidos();
      return;
    }
    const email = JSON.parse(localStorage.getItem("usuario")!).email;
    const pedidosMostrar = await mostrarPedidosPorEstadoCliente(email,estado);
    await renderizarPedidos(pedidosMostrar);
  } catch (error) {
    console.error(`Error al cargar pedidos con estado ${estado}:`, error);
  }
}

//Evento del select
filtroSelect?.addEventListener("change", () => {
  const estado = filtroSelect.value;
  cargarPedidosPorEstado(estado);
});

// Carga inicial
cargarPedidos();
