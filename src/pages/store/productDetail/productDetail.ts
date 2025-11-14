interface ICategoria {
  nombre: String;
  imagen: string;
  descrpicion:string;
  //en ICategoria sale que hay que cambiar esto
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


//  'fetch' al backend
async function getProductById(id: string): Promise<IProduct> {
  
  const response = await fetch(`http://localhost:8080/productos/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo encontrar el producto.`);
  }
  
  const producto: IProduct = await response.json();
  return producto;
}


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

  // Lógica de estado y stock
  // uso el campo "estado"
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

// botón agregar al carrito
function setupAddToCartButton(product: IProduct) { // Ahora recibe el producto
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
  const confirmationMessage = document.getElementById('confirmation-message');

  if (!addToCartBtn || !quantityInput || !confirmationMessage) return;

  addToCartBtn.addEventListener('click', () => {
    const cantidad = parseInt(quantityInput.value, 10);
    
    // usamos el producto 
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

    console.log(`Agregando ${cantidad} del producto ${product.id} al carrito.`);
    
    confirmationMessage.style.display = 'block';
    
    setTimeout(() => {
      confirmationMessage.style.display = 'none';
    }, 3000); 
  });
}


//punto de entrada
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // leemos el ID del producto desde la URL
    // (Ej: productDetail.html?id=3)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
      alert('Error: No se ha especificado un ID de producto en la URL.');
      return;
    }

    // llamamos a la API para traer el producto 
    const productoReal = await getProductById(productId);

    // mostramos/renderizamos el producto 
    renderProduct(productoReal);
    
    // configuramos el botón con el producto 
    setupAddToCartButton(productoReal);

  } catch (error) {
    console.error("Error al cargar el producto:", error);
    // Mostramos un error en la página
    const container = document.querySelector('.product-detail-container');
    if (container) {
      container.innerHTML = `<h1>Error al cargar el producto.</h1><p>${error.message}</p>`;
    }
  }
});