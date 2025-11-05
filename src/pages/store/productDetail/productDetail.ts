import type { ICategoria } from "../../../types/ICategoria";

/* 
interface de producto
*/
interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: ICategoria; // a revisar
    disponible: boolean; // esto no se muestra en los detalles del producto pero si en la barra, lo cargo por las dudas
    imagenUrl: string;
}


//acá el html se deberia de cargar y ahi empieza 
document.addEventListener('DOMContentLoaded', () => {

    // end points para obtener y crear nuestros productos
    const API_URL_GET = 'http://localhost:8080/productos';   // OBTENER - GET
    const API_URL_POST = 'http://localhost:8080/productos';  // CREAR - POST
                                                             //dudo en en que esten bien los endpoints, por las dudas genere dos variables

    // seleccionar los elementos del DOM
    const btnAbrirModal = document.getElementById('btnAgregarCat');
    const modal = document.getElementById('modal-nuevo-producto');
    const btnCerrarModal = document.getElementById('modal-close-btn');
    const formNuevoProducto = document.getElementById('form-nuevo-producto') as HTMLFormElement;
    const tableBody = document.getElementById('product-table-body');

    //MODAL abrir/cerrar

    //abro el modal
    function abrirModal() {
        modal?.classList.add('is-active');
    }

    //cierro el modal
    function cerrarModal() {
        modal?.classList.remove('is-active');
    }

    // -a cada "click" le digo que tiene que hacer
    btnAbrirModal?.addEventListener('click', abrirModal);
    btnCerrarModal?.addEventListener('click', cerrarModal);

    // si toca afuera de la caja que se cierre/salga
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    //obtener la info y mostrar los datos

    
    function cargarProductosEnTabla(productos: Producto[]) {
        if (!tableBody) return;

        // supuestamente es buena práctica limpiar la tabla antes
        tableBody.innerHTML = '';

        // recorrer la tabla y crear un <tr> para cada uno
        //revisar si hacer validacion en esta funcion
        productos.forEach(producto => {
            const filaHtml = `
                <tr>
                    <td>${producto.id}</td>
                    <td>
                        <img class="product-table_image" src="${producto.imagenUrl}" alt="${producto.nombre}">
                    </td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${producto.precio.toFixed(2)}</td> //este no entiendo del todo por que es asi
                    <td>${producto.categoria}</td> 
                    <td>
                        <span class="product-table_stock ${producto.stock > 0 ? 'product-table_stock--available' : 'product-table_stock--unavailable'}">
                            ${producto.stock > 0 ? 'si' : 'no'}
                        </span>// en esta linea manejamos si hay suficiente cantidad de producto/s
                        
                    </td>
                    <td>${producto.disponible ? 'Activo' : 'Inactivo'}</td>
                    <td class="product-table_actions">
                        <button class="product-table_btn product-table_btn--edit" data-id="${producto.id}">Editar</button>
                        <button class="product-table_btn product-table_btn--delete" data-id="${producto.id}">Eliminar</button>
                    </td>
                    //este es un intento de mostrar si el producto esta disponible o no
                </tr>
            `;
            // insertar la tabla en la fila
            tableBody.innerHTML += filaHtml;
        });
    }

    // fetch para obtener la lista de productos y despues llamamos a 'cargarProductosEnTabla' para cargarlos
     
    function obtenerYcargarProductos() {
        fetch(API_URL_GET)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: Producto[]) => {
                // 'data' es el array de productos que nos viene
                cargarProductosEnTabla(data);
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
                if (tableBody) {
                    tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Error al cargar los productos, error de front.</td></tr>';
                }
            });
    }

    // crear nuevo producto

    formNuevoProducto?.addEventListener('submit', (event) => {
        // esto es para que la página no se recargue
        event.preventDefault();

        // obtener la info del formulario
        const formData = new FormData(formNuevoProducto);

        // creamos los objetos del nuevo producto --> REVISAR LOS NOMBRES 
        const nuevoProducto = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio: Number(formData.get('precio')),
            stock: Number(formData.get('stock')),
            categoria: formData.get('categoria'),
            imagenUrl: formData.get('imagenUrl'),
            disponible: (formData.get('disponible') === 'on') // Checkbox devuelve 'on'
        };

        // envio los datos con un post
        fetch(API_URL_POST, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProducto),
        })
        .then(response => {
            if (!response.ok) {
                // si las cosas salen mal creo que nos devolveria un 400 o un 500, en teoria
                throw new Error(`Error al crear el producto: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto creado con éxito:', data);
            
            // si las cosas salieron bien :D
            cerrarModal();          // cerramos el formulario
            formNuevoProducto.reset(); // limpiamos los campos, nose si es necesario, creo que no esta de más
            
            // cargamos de vuelta la tabla para mostrar el producto
            obtenerYcargarProductos(); 
        })
        .catch(error => {
            console.error('Error en el submit del formulario:', error);
            alert('Error al guardar el producto. Revisa la consola para más detalles.');
        });
    });

    //cargar la página
    
    obtenerYcargarProductos();

});