import type { ICartItem } from "../../../types/ICart";
import { getCart, saveCart } from '../../../utils/cart';
// ---

interface ICategoria {
  nombre: String;
  imagen: string;
  descrpicion:string;
}

interface IProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  disponible?: boolean; 
  estado?: 'DISPONIBLE' | 'NO DISPONIBLE'; 
  imagen?: string; 
  categoria?: ICategoria; 
}


// 'fetch' al backend (Esta parte está bien)
async function getProductById(id: string): Promise<IProduct> {
  const response = await fetch(`http://localhost:8080/productos/${id}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo encontrar el producto.`);
  }
  const producto: IProduct = await response.json();
  return producto;
}

// renderProduct (Esta parte está bien)
function renderProduct(product: IProduct) {
  const imgElement = document.getElementById('product-image') as HTMLImageElement; 
  const nameElement = document.getElementById('product-name'); 
  const statusElement = document.getElementById('product-status'); 
  const priceElement = document.getElementById('product-price'); 
  const descriptionElement = document.getElementById('product-description'); 
  const stockElement = document.getElementById('product-stock'); 
  const quantityInput = document.getElementById('quantity-input') as HTMLInputElement; 
  const addToCartBtn = document.getElementById('add-to-cart-btn') as HTMLButtonElement; 

  if (!imgElement || !nameElement || !statusElement || !priceElement || !descriptionElement || !stockElement || !quantityInput || !addToCartBtn) {
    console.error("Error: No se encontraron todos los elementos del DOM.");
    return;
  }

  imgElement.src = product.imagen || 'https://via.placeholder.com/600x400.png?text=Sin+Imagen';
  imgElement.alt = `Imagen de ${product.nombre}`;
  nameElement.textContent = product.nombre;
  priceElement.textContent = `$${product.precio.toFixed(2)}`;
  descriptionElement.textContent = product.descripcion;
  stockElement.textContent = `Stock disponible: ${product.stock} unidades`;

  if (product.estado === 'DISPONIBLE' && product.stock > 0) {
    statusElement.textContent = "Disponible";
    statusElement.className = "product-status available";
    quantityInput.max = product.stock.toString(); 
    addToCartBtn.disabled = false;
  } else {
    statusElement.textContent = "No disponible";
    statusElement.className = "product-status unavailable";
    quantityInput.value = "0";
    quantityInput.disabled = true;
    addToCartBtn.textContent = "Sin Stock";
    addToCartBtn.disabled = true; 
  }
}

// --- ¡ESTA ES LA FUNCIÓN CORREGIDA! ---
// (Reemplaza la tuya por esta)
function setupAddToCartButton(product: IProduct) {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
  const confirmationMessage = document.getElementById('confirmation-message');

  if (!addToCartBtn || !quantityInput || !confirmationMessage) return;

  addToCartBtn.addEventListener('click', () => {
    const cantidad = parseInt(quantityInput.value, 10);

    // Tus validaciones (están perfectas)
    if (cantidad > product.stock) {
      alert("No puedes agregar más que el stock disponible");
      quantityInput.value = product.stock.toString();
      return;
    }
    if (cantidad <= 0) {
      alert("La cantidad debe ser al menos 1");
      quantityInput.value = "1";
      return;
    }

    // --- LÓGICA DE CARRITO (LA QUE FALTABA) ---
    const carrito = getCart();
    const productoEnCarrito = carrito.find(item => item.id === product.id);

    if (productoEnCarrito) {
      const nuevaCantidad = productoEnCarrito.cantidad + cantidad;
      if (nuevaCantidad > product.stock) {
        alert(`Ya tienes ${productoEnCarrito.cantidad} en el carrito. No puedes agregar ${cantidad} más (Stock total: ${product.stock}).`);
        return;
      }
      productoEnCarrito.cantidad = nuevaCantidad;
    } else {
      // Necesitamos la interfaz ICartItem aquí
      const nuevoItem: ICartItem = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen || 'https://via.placeholder.com/150',
        stock: product.stock,
        cantidad: cantidad
      };
      carrito.push(nuevoItem);
    }

    saveCart(carrito);
    // --- FIN DE LÓGICA DE CARRITO ---

    // Tu mensaje de confirmación (está bien)
    console.log(`Agregando ${cantidad} del producto ${product.id} al carrito.`);
    console.log("Carrito actual:", carrito); 
    confirmationMessage.style.display = 'block';
    
    setTimeout(() => {
      confirmationMessage.style.display = 'none';
    }, 3000); 
  });
}


// punto de entrada (Esta parte está bien)
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
      alert('Error: No se ha especificado un ID de producto en la URL.');
      return;
    }

    const productoReal = await getProductById(productId);
    renderProduct(productoReal);
    setupAddToCartButton(productoReal); // <-- Llama a la función corregida

  } catch (error) {
    console.error("Error al cargar el producto:", error);
    const container = document.querySelector('.product-detail-container');
    if (container) {
      // Corrijo la sintaxis que estaba rota
      container.innerHTML = `<h1>Error al cargar el producto.</h1><p>${error.message}</p>`;
    }
  }
});