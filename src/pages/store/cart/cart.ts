// /src/pages/store/cart/cart.ts

// Importamos los tipos (ajusta la ruta si es necesario)
import type { ICartItem } from '../../../types/ICart';
import type { IProductos } from '../../../types/IProductos';

// --- CONSTANTES ---
const COSTO_ENVIO_FIJO = 500;
const CART_STORAGE_KEY = 'foodStoreCart';

// --- SERVICIO DE CARRITO (LocalStorage) ---
// Estas funciones podrían estar en /src/utils/cart.ts y ser importadas

/**
 * Obtiene el carrito actual desde localStorage.
 * @returns {ICartItem[]} El array de items del carrito.
 */
function getCart(): ICartItem[] {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * Guarda el carrito en localStorage.
 * @param {ICartItem[]} cart El array de items del carrito.
 */
function saveCart(cart: ICartItem[]): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Limpia el carrito de localStorage.
 */
function clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
}

/**
 * Actualiza la cantidad de un producto o lo elimina si la cantidad es 0.
 * @param {number} productId El ID del producto.
 * @param {'increase' | 'decrease'} action La acción a realizar.
 */
function updateProductQuantity(productId: number, action: 'increase' | 'decrease'): void {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex === -1) return; // No se encontró el producto

    // Obtenemos el item para fácil acceso
    const item = cart[productIndex];

    if (action === 'increase') {
        // --- ¡VALIDACIÓN DE STOCK AÑADIDA! ---
        if (item.cantidad >= item.stock) {
            // Si la cantidad actual ya es igual (o mayor) al stock,
            // mostramos un error y no hacemos nada.
            showNotification(`Stock máximo alcanzado para ${item.nombre} (${item.stock} unidades)`, 'error');
            return; // Detiene la ejecución de la función
        }
        // --- FIN DE LA VALIDACIÓN ---

        item.cantidad++; // Solo se ejecuta si la validación pasa

    } else if (action === 'decrease') {
        item.cantidad--;
        if (item.cantidad <= 0) {
            // Elimina el item si la cantidad llega a 0
            cart.splice(productIndex, 1);
        }
    }
    
    saveCart(cart);
    renderPage(); // Re-dibuja toda la página
}
/**
 * Elimina un producto del carrito, sin importar la cantidad.
 * @param {number} productId El ID del producto.
 */
function removeProductFromCart(productId: number): void {
    let cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    renderPage(); // Re-dibuja toda la página
}

// --- SELECCIÓN DE ELEMENTOS DEL DOM ---

// Contenedores
const cartItemsList = document.getElementById('cart-items-list') as HTMLDivElement;
const cartEmptyMessage = document.getElementById('cart-empty-message') as HTMLDivElement;
const cartSummaryBox = document.getElementById('cart-summary-box') as HTMLDivElement;

// Campos del Resumen
const summarySubtotal = document.getElementById('summary-subtotal') as HTMLSpanElement;
const summaryShipping = document.getElementById('summary-shipping') as HTMLSpanElement;
const summaryTotal = document.getElementById('summary-total') as HTMLSpanElement;

// Botones Principales
const btnProceedCheckout = document.getElementById('btn-proceed-checkout') as HTMLButtonElement;
const btnEmptyCart = document.getElementById('btn-empty-cart') as HTMLButtonElement;

// Modal de Checkout
const checkoutModal = document.getElementById('checkout-modal') as HTMLDivElement;
const checkoutForm = document.getElementById('checkout-form') as HTMLFormElement;
const btnCancelCheckout = document.getElementById('btn-cancel-checkout') as HTMLButtonElement;

// Modal de Confirmación (Vaciar Carrito)
const confirmEmptyModal = document.getElementById('confirm-empty-modal') as HTMLDivElement;
const btnCancelEmpty = document.getElementById('btn-cancel-empty') as HTMLButtonElement;
const btnConfirmEmpty = document.getElementById('btn-confirm-empty') as HTMLButtonElement;

// --- FUNCIONES DE RENDERIZADO ---

/**
 * Dibuja la lista de items en el carrito.
 */
function renderCartItems(): void {
    const cart = getCart();
    // Limpiamos la lista actual (excepto el mensaje de vacío)
    cartItemsList.innerHTML = ''; 
    cartItemsList.appendChild(cartEmptyMessage); // Re-adjuntamos el mensaje

    if (cart.length === 0) {
        cartEmptyMessage.classList.remove('hidden');
        cartSummaryBox.classList.add('hidden'); // Oculta el resumen si el carrito está vacío
    } else {
        cartEmptyMessage.classList.add('hidden');
        cartSummaryBox.classList.remove('hidden'); // Muestra el resumen

        cart.forEach(item => {
            const itemTotalPrice = item.precio * item.cantidad;
            const isStockReached = item.cantidad >= item.stock;
            // Creamos el HTML para cada item
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            // Usamos data-product-id para identificar el producto en los eventos
            itemElement.dataset.productId = item.id.toString(); 
            
            itemElement.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.nombre}</h4>
                    <p class="cart-item-price">$${item.precio.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <input type="text" class="quantity-input" value="${item.cantidad}" readonly>
                    <button class="quantity-btn" data-action="increase">+</button>
                </div>
                <span class="cart-item-total">$${itemTotalPrice.toFixed(2)}</span>
                <button class="cart-item-remove" data-action="remove">&times;</button>
            `;
            // Insertamos el item antes del mensaje de "vacío"
            cartItemsList.insertBefore(itemElement, cartEmptyMessage);
        });
    }
}

/**
 * Calcula y actualiza los totales del resumen.
 */
function updateSummary(): void {
    const cart = getCart();
    
    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
    // Si el subtotal es 0, el total es 0 (no se cobra envío)
    const total = subtotal > 0 ? subtotal + COSTO_ENVIO_FIJO : 0;
    
    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    summaryShipping.textContent = `$${COSTO_ENVIO_FIJO.toFixed(2)}`;
    summaryTotal.textContent = `$${total.toFixed(2)}`;

    // Deshabilitar botón de pago si el carrito está vacío
    btnProceedCheckout.disabled = cart.length === 0;
    btnEmptyCart.disabled = cart.length === 0;
}

/**
 * Dibuja la página completa (items y resumen).
 */
function renderPage(): void {
    renderCartItems();
    updateSummary();
}

// --- MANEJO DE EVENTOS ---

/**
 * Maneja los clics en los botones (+, -, remove) usando delegación de eventos.
 */
function handleCartActions(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Buscamos el 'data-action' en el botón clickeado
    const action = target.dataset.action;
    if (!action) return;

    // Buscamos el 'cart-item' padre para obtener el ID del producto
    const cartItemElement = target.closest('.cart-item') as HTMLDivElement;
    if (!cartItemElement) return;

    const productId = Number(cartItemElement.dataset.productId);
    if (!productId) return;

    // Actuamos según la acción
    switch (action) {
        case 'increase':
            updateProductQuantity(productId, 'increase');
            break;
        case 'decrease':
            updateProductQuantity(productId, 'decrease');
            break;
        case 'remove':
            removeProductFromCart(productId);
            break;
    }
}

/**
 * Maneja el envío del formulario de checkout.
 */
async function handleSubmitOrder(event: Event): Promise<void> {
    event.preventDefault(); // Evita que la página se recargue
    
    // Obtenemos los datos del formulario
    const phone = (document.getElementById('checkout-phone') as HTMLInputElement).value;
    const address = (document.getElementById('checkout-address') as HTMLInputElement).value;
    const paymentMethod = (document.getElementById('checkout-payment') as HTMLSelectElement).value;
    const notes = (document.getElementById('checkout-notes') as HTMLTextAreaElement).value;
    
    // Validaciones básicas (HTML 'required' ya hace la mayoría)
    if (!phone || !address) {
        showNotification('Por favor, completa el teléfono y la dirección.', 'error');
        return;
    }

    const cart = getCart();
    
    // Construimos el objeto del pedido (DTO - Data Transfer Object)
    // Esto debe coincidir con lo que espera tu API de Spring Boot
    const orderData = {
        telefono: phone,
        direccionEntrega: address,
        metodoPago: paymentMethod,
        notas: notes,
        items: cart.map(item => ({
            idProducto: item.id,
            cantidad: item.cantidad
        })),
        total: parseFloat(summaryTotal.textContent?.replace('$', '') || '0')
    };

    console.log('Enviando pedido a la API:', orderData);

    try {
        // --- ¡AQUÍ VA TU LLAMADA A LA API! ---
        // Ejemplo (debes tener una función así en tu api.ts)
        // const response = await tuApi.post('/pedidos', orderData);

        // --- Simulación de éxito ---
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        // --- Fin de simulación ---

        // Si el pedido es exitoso:
        showNotification('¡Pedido realizado con éxito!', 'success');
        clearCart();
        renderPage();
        closeModal(checkoutModal);
        checkoutForm.reset();

    } catch (error) {
        console.error('Error al crear el pedido:', error);
        showNotification('Error al procesar el pedido. Inténtalo de nuevo.', 'error');
    }
}

// --- Funciones de Modales y Notificaciones ---

function openModal(modal: HTMLDivElement): void {
    modal.classList.remove('hidden');
}

function closeModal(modal: HTMLDivElement): void {
    modal.classList.add('hidden');
}

/**
 * Muestra un mensaje profesional.
 * @param {string} message El texto del mensaje.
 * @param {'success' | 'error'} type El tipo de mensaje.
 */
function showNotification(message: string, type: 'success' | 'error'): void {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'}`; // Asumiendo que tienes clases para esto
    
    // Estilos básicos si no tienes clases de 'alert'
    notif.style.padding = '15px';
    notif.style.marginBottom = '10px';
    notif.style.borderRadius = '5px';
    notif.style.color = type === 'success' ? '#155724' : '#721c24';
    notif.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    notif.style.borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
    
    notif.textContent = message;
    
    container.appendChild(notif);
    
    // Desaparece después de 3 segundos
    setTimeout(() => {
        notif.remove();
    }, 3000);
}


// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Dibuja la página al cargar
    renderPage();

    // 2. Asigna eventos a los botones principales
    btnProceedCheckout.addEventListener('click', () => openModal(checkoutModal));
    btnEmptyCart.addEventListener('click', () => openModal(confirmEmptyModal));

    // 3. Asigna eventos a la lista de items (Delegación)
    cartItemsList.addEventListener('click', handleCartActions);

    // 4. Asigna eventos a los modales
    btnCancelCheckout.addEventListener('click', () => closeModal(checkoutModal));
    checkoutForm.addEventListener('submit', handleSubmitOrder);
    
    btnCancelEmpty.addEventListener('click', () => closeModal(confirmEmptyModal));
    btnConfirmEmpty.addEventListener('click', () => {
        clearCart();
        renderPage();
        closeModal(confirmEmptyModal);
        showNotification('El carrito se ha vaciado.', 'success');
    });

    // 5. Cierra modales si se hace clic fuera del contenido
    [checkoutModal, confirmEmptyModal].forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
});