import { obtenerCategorias, obtenerProductos } from "../../utils/api";
import type { ICategoriaMostrar } from "../../types/ICategoria";
import type { IProductosMostrar } from "../../types/IProductos";



// ------------------- lista de categorias para mostrar nombre al renderizar las tarjetas -------------------
// esto lo necesitamos porque el backend solo devuelve un id de categoria y
//  con esto buscamos las categorias y podemos obtener el nombre
let categoriasGlobal: ICategoriaMostrar[] = [];

// ------------------- SELECTORES -------------------
const categoriaPanel = document.getElementById("categoriasPanel") as HTMLElement | null;
const cardContainer = document.querySelector(".card_container-productos") as HTMLElement | null;


// ------------------- LOGICA -------------------


// fx para cargar las categorias en el aside y poder usarlo de filtros
const cargarCategorias = async (): Promise<void> => {

    try{
        const categorias = await obtenerCategorias();
        //guardamos las categorias en el array de categorias para despeus acarle el nombre
        categoriasGlobal = categorias;
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
        });

        // obtener el boton de ver todo una vez tenemos sus categorias
        const btonVerTodo = document.getElementById("btnVerTodo");
        btonVerTodo?.addEventListener("click", ()=> {
            cargarProductos();
        });


    } catch (err) {
        console.error("Se produjo un error al listar las categorias: ", err);
        
    }
};


// fx para renderizar tarjetas de productos
const renderizarProductos = (productos: IProductosMostrar[]): void => {
    if(!cardContainer) return;
    // limpiamos el contenedor antes de renderizar nuevamente
    cardContainer.innerHTML = "";
    
    productos.forEach((prod) => {

        // traer los nombres de las categorias
        const nombreCategoria = "Producto";



        const card = document.createElement("section");
        card.classList.add("home_card-producto");
        
        card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}" class="home_product-img">
        <div class="home_prod-card">
        <h4>${nombreCategoria}</h4>
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion}</p>
        <div class="home_producto-precio">
        <span class="home_precio">$${prod.precio.toFixed(2)}</span>
        <span class="estado ${prod.estado === "DISPONIBLE" ? "disponible" : "nodisponible"}">
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


