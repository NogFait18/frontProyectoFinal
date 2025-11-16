import {
    obtenerCategorias,
    obtenerProductos,
    obtenerProductosPorCategoria,
} from "../../utils/api";
import type { ICategoriaMostrar } from "../../types/ICategoria";
import type { IProductosMostrar } from "../../types/IProductos";

// ------------------- lista de categorias para mostrar nombre al renderizar las tarjetas -------------------
// esto lo necesitamos porque el backend solo devuelve un id de categoria y
//  con esto buscamos las categorias y podemos obtener el nombre
// let categoriasGlobal: ICategoriaMostrar[] = [];

// ------------------- SELECTORES -------------------
const categoriaPanel = document.getElementById(
    "categoriasPanel"
) as HTMLElement | null;
const cardContainer = document.querySelector(
    ".card_container-productos"
) as HTMLElement | null;


// selector contador carrito
const contadorCarrito = document.getElementById("cart_count") as HTMLElement | null;



// ------------------- LOGICA -------------------

// fx para actualizar el gadget del carrito
const infoLocalStorage = localStorage.getItem("carrito");
if(infoLocalStorage){
    const cart = JSON.parse(infoLocalStorage);
    const cantidadProductos = cart.length;
    console.log("lenght del array de cart");
    console.log(cantidadProductos);
    

    if(contadorCarrito){
        contadorCarrito.textContent = cantidadProductos;
    }
    
};




// fx para cargar las categorias en el aside y poder usarlo de filtros
const cargarCategorias = async (): Promise<void> => {
    try {
        const categorias = await obtenerCategorias();
        //guardamos las categorias en el array de categorias para despeus acarle el nombre
        // categoriasGlobal = categorias;
        if (!categoriaPanel) return;
        categoriaPanel.innerHTML = `
        <section class="panelControl">
        <button class="categoria_btn-filtro" id="btnVerTodo">🍽️ Ver todo</button>
        </section>`;

        categorias.forEach((cat: ICategoriaMostrar) => {
            const sectionNuevaCat = document.createElement("section");
            sectionNuevaCat.classList.add("panelControl");

            sectionNuevaCat.innerHTML = `
        <button class="categoria_btn-filtro" data-id="${cat.id}">
        ${cat.nombre}
        </button>`;

            categoriaPanel.appendChild(sectionNuevaCat);
        });

        // funcionalidad de filtrado por categorias
        categoriaPanel.querySelectorAll(".categoria_btn-filtro").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const idString = (e.target as HTMLElement).dataset.id;

                // si no hay id → es el botón "Ver todo"
                if (!idString) {
                    cargarProductos();
                    return;
                }

                const idCategoria = parseInt(idString);

                try {
                    const productos = await obtenerProductosPorCategoria(idCategoria);
                    renderizarProductos(productos);
                } catch (error) {
                    console.error("Error al cargar productos por categoría:", error);
                }
            });
        });

        // obtener el boton de ver todo una vez tenemos sus categorias
        const btonVerTodo = document.getElementById("btnVerTodo");
        btonVerTodo?.addEventListener("click", () => {
            cargarProductos();
        });
    } catch (err) {
        console.error("Se produjo un error al listar las categorias: ", err);
    }
};

// fx para renderizar tarjetas de productos
const renderizarProductos = (productos: IProductosMostrar[]): void => {
    if (!cardContainer) return;
    // limpiamos el contenedor antes de renderizar nuevamente
    cardContainer.innerHTML = "";

    productos.forEach((prod) => {

        const card = document.createElement("section");
        card.classList.add("home_card-producto");

        // añadimos el id del producto al section
        card.dataset.id = prod.id.toString();

        // selector para tarjeta de productos por id para product detail
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            window.location.href = `/src/pages/store/productDetail/productDetail.html?id=${id}`;
        });

        card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}" class="home_product-img">
        <div class="home_prod-card">
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion}</p>
        <div class="home_producto-precio">
        <span class="home_precio">$${prod.precio.toFixed(2)}</span>
        <span class="estado ${prod.estado === "DISPONIBLE" ? "disponible" : "nodisponible"
            }">
        ${prod.estado}
        </span>
        </div>
        </div>
        `;

        cardContainer.appendChild(card);
    });
};

// fx para obtener los productos
const cargarProductos = async (): Promise<void> => {
    try {
        const productos = await obtenerProductos();
        renderizarProductos(productos);
    } catch (err) {
        console.error("Se produjo un error al cargar los productos: ", err);
    }
};

// ------------------- INICIALIZACIÓN -------------------
cargarCategorias();
cargarProductos();
