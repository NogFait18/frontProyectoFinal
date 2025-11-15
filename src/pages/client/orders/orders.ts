import { mostrarPedidosCliente, mostrarPedidos, mostrarPedidosPorEstadoCliente, traerUsuarioPorId } from "../../../utils/api";
import { obtenerCategorias } from "../../../utils/api";
import type { ICategoriaMostrar } from "../../../types/ICategoria";



//Logica del sidebar de categorias

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

     div.addEventListener("click", () => {
        abrirModalConPedido(p);  // función que vas a crear
        }); 


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



/*   Funcion para abrir el modal del pedido Cliente */

function abrirModalConPedido(pedido: any){
    const modal = document.getElementById("modalPedido")!;
    const div = document.getElementById("modalPedidoContenido")!;
    div.classList = "";
    div.classList.add(`pedido-${pedido.estado.toLowerCase()}`); 

      div.innerHTML = `

        <div class="pedido-header">
            <h4>Pedido #${pedido.id}</h4>
            <span class= "estado" >${pedido.estado}</span>
        </div>
    <div class = "modal_body">    
        <p><strong>Fecha:</strong> ${pedido.fecha}</p>
        <p><strong>Estado:</strong> ${pedido.estado}</p>

        <h4>Productos</h4>
        <ul>
        ${pedido.detalles
            .map(
        (d: any) =>

        `   <li class="item-producto">
            <img src="${d.productoDto.imagen}" alt="${d.productoDto.nombre}">
            <span>${d.productoDto.nombre}</span>
            <span>$${d.productoDto.precio}</span>
            <span>x${d.cantidad}</span>
            </li>`
        )
        .join("")}

        </ul>

            <p class = "detallePedido_total" ><strong>Total:</strong> $${pedido.total}</p>
        </div>
        `;

  modal.classList.remove("oculto");

}




// Carga inicial
cargarPedidos();



// Evento para cerrar el modal de pedido

document.getElementById("cerrarModal")?.addEventListener("click", () => {
  document.getElementById("modalPedido")?.classList.add("oculto");
});