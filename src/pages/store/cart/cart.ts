// ARCHIVO: src/pages/store/cart/cart.ts

import type { ICartItem } from '../../../types/ICart';
import type { IProductos } from '../../../types/IProductos';
import { crearPedido, obtenerIdUsuario } from '../../../utils/api';

// Importamos las funciones, NO las definimos aquí
import { getCart, saveCart, clearCart } from '../../../utils/cart';

// --- CONSTANTES ---
const COSTO_ENVIO_FIJO = 500;

// --- FUNCIONES DE SERVICIO (update, remove) ---
// (Estas funciones no cambian)
function updateProductQuantity(productId: number, action: 'increase' | 'decrease'): void {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex === -1) return;
    const item = cart[productIndex];
    if (action === 'increase') {
        if (item.cantidad >= item.stock) {
            showNotification(`Stock máximo alcanzado para ${item.nombre} (${item.stock} unidades)`, 'error');
            return;
        }
        item.cantidad++;
    } else if (action === 'decrease') {
        item.cantidad--;
        if (item.cantidad <= 0) {
            cart.splice(productIndex, 1);
        }
    }
    saveCart(cart);
    renderPage();
}

function removeProductFromCart(productId: number): void {
    let cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    renderPage();
}

// --- SELECCIÓN DE ELEMENTOS DEL DOM ---
// ¡LOS DECLARAMOS AQUÍ, PERO NO LOS ASIGNAMOS!
let cartItemsList: HTMLDivElement | null;
let cartEmptyMessage: HTMLDivElement | null;
let cartSummaryBox: HTMLElement | null;
let summarySubtotal: HTMLSpanElement | null;
let summaryShipping: HTMLSpanElement | null;
let summaryTotal: HTMLSpanElement | null;
let btnProceedCheckout: HTMLButtonElement | null;
let btnEmptyCart: HTMLButtonElement | null;
let checkoutModal: HTMLDivElement | null;
let checkoutForm: HTMLFormElement | null;
let btnCancelCheckout: HTMLButtonElement | null;
let confirmEmptyModal: HTMLDivElement | null;
let btnCancelEmpty: HTMLButtonElement | null;
let btnConfirmEmpty: HTMLButtonElement | null;
let notificationContainer: HTMLDivElement | null;

// --- FUNCIONES DE RENDERIZADO ---
// (Estas funciones no cambian, pero ahora deben chequear si los elementos existen)
function renderCartItems(): void {
    const cart = getCart();

    // ¡Chequeo de seguridad!
    if (!cartItemsList || !cartEmptyMessage) return;

    cartItemsList.innerHTML = '';
    cartItemsList.appendChild(cartEmptyMessage);

    if (cart.length === 0) {
        cartEmptyMessage.classList.remove('hidden');
        if (cartSummaryBox) cartSummaryBox.classList.add('hidden');
    } else {
        cartEmptyMessage.classList.add('hidden');
        if (cartSummaryBox) cartSummaryBox.classList.remove('hidden');

        cart.forEach(item => {
            const itemTotalPrice = item.precio * item.cantidad;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
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
            cartItemsList?.insertBefore(itemElement, cartEmptyMessage);
        });
    }
}

// Funcion para calcular subtotal creo 

function updateSummary(): void {
    const cart = getCart();
    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const total = subtotal > 0 ? subtotal : 0;

    // ¡Chequeo de seguridad!
    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryShipping) summaryShipping.textContent = `$${COSTO_ENVIO_FIJO.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;

    if (btnProceedCheckout) btnProceedCheckout.disabled = cart.length === 0;
    if (btnEmptyCart) btnEmptyCart.disabled = cart.length === 0;
}

function renderPage(): void {
    renderCartItems();
    updateSummary();
}

// --- MANEJO DE EVENTOS --- para sumar, restar o remover los items
function handleCartActions(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    if (!action) return;

    const cartItemElement = target.closest('.cart-item') as HTMLDivElement;
    if (!cartItemElement) return;

    const productId = Number(cartItemElement.dataset.productId);
    if (!productId) return;

    switch (action) {
        case 'increase': updateProductQuantity(productId, 'increase'); break;
        case 'decrease': updateProductQuantity(productId, 'decrease'); break;
        case 'remove': removeProductFromCart(productId); break;
    }
}

async function obtenerInfoEntrega(event: Event): Promise<void> {
    event.preventDefault();

    // Obtenemos los datos del formulario (esto está bien dentro del evento)
    const phone = (document.getElementById('checkout-phone') as HTMLInputElement).value;
    const address = (document.getElementById('checkout-address') as HTMLInputElement).value;
    const paymentMethod = (document.getElementById('checkout-payment') as HTMLSelectElement).value;
    const notes = (document.getElementById('checkout-notes') as HTMLTextAreaElement).value;

    if (!phone || !address) {
        showNotification('Por favor, completa el teléfono y la dirección.', 'error');
        return;
    }

    // aca estamos tocando nosotros

    // recuperar carrito del localStorage
    const carritoLS = localStorage.getItem("carrito");
    if (!carritoLS) {
        showNotification('El carrito está vacío.', 'error');
        return;
    }

    // parseamos el carrito
    const carrito = JSON.parse(carritoLS);

    // convertimos los datos del carro a como lo debemos dejar en el formato para la request
    const detalles = carrito.map((item: any) => ({
        cantidad: item.cantidad,
        productoId: item.id
    }))

    // armamos estructura para request

    const pedidoFinal = {
        dto: {
            detalles: detalles
        },
        infoEntrega: {
            telefono: phone,
            direccion: address,
            formaDePago: paymentMethod.toUpperCase(),
            notaAdicional: notes
        }
    };
    console.log("Console log para debugear el carro, ver formato de pedido final");
    console.log(pedidoFinal);

    // traemos un usuario
    const usuarioLocalStorage = localStorage.getItem("usuario");

    let usuarioParseado: any = null;

    if (usuarioLocalStorage) {
        try {
            const primerParse = JSON.parse(usuarioLocalStorage);
            // Si al parsear, todavía es un string JSON → parsear de nuevo
            usuarioParseado = typeof primerParse === "string"
                ? JSON.parse(primerParse)
                : primerParse;
        } catch (error) {
            console.error("Error al parsear usuario:", error);
        }
    }

    // Obtener el email del usuario
    const emailUsuario = usuarioParseado?.email;

    // obtenemos el id del usuario
    const idUsuario = await obtenerIdUsuario(emailUsuario);
    if (!idUsuario) {
        showNotification("Error: no se pudo obtener el ID del usuario", "error");
        return;
    }
    // le pasamos a la funcion del api que crea el pedido, con el data y el id del usuario
    try {
        const respuesta = await crearPedido(idUsuario, pedidoFinal);
        console.log("Respuesta del backend:", respuesta);

        showNotification("¡Pedido creado con éxito!", "success");

        // limpiar carrito
        localStorage.removeItem("carrito");

        // cerrar modal si existe
        const checkoutModal = document.getElementById("checkout-modal");
        if (checkoutModal) checkoutModal.classList.add("hidden");
        window.location.href = "../../client/orders/orders.html";

    } catch (error) {
        console.error("Error creando el pedido:", error);
        showNotification("Error al crear el pedido.", "error");
    }

};


// --- Funciones de Modales y Notificaciones ---
function openModal(modal: HTMLDivElement | null): void {
    if (modal) modal.classList.remove('hidden');
}

function closeModal(modal: HTMLDivElement | null): void {
    if (modal) modal.classList.add('hidden');
}

function showNotification(message: string, type: 'success' | 'error'): void {
    // ¡Movemos la selección del container aquí para que no sea null!
    notificationContainer = document.getElementById('notification-container') as HTMLDivElement;
    if (!notificationContainer) return;

    const notif = document.createElement('div');
    notif.className = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'}`;
    notif.style.padding = '15px';
    notif.style.marginBottom = '10px';
    notif.style.borderRadius = '5px';
    notif.style.color = type === 'success' ? '#155724' : '#721c24';
    notif.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    notif.style.borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
    notif.textContent = message;

    notificationContainer.appendChild(notif);

    setTimeout(() => { notif.remove(); }, 3000);
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {

    // --- ¡AQUÍ ES DONDE ASIGNAMOS LAS VARIABLES! ---
    cartItemsList = document.getElementById('cart-items-list') as HTMLDivElement;
    cartEmptyMessage = document.getElementById('cart-empty-message') as HTMLDivElement;
    cartSummaryBox = document.getElementById('cart-summary-box') as HTMLElement;
    summarySubtotal = document.getElementById('summary-subtotal') as HTMLSpanElement;
    summaryShipping = document.getElementById('summary-shipping') as HTMLSpanElement;
    summaryTotal = document.getElementById('summary-total') as HTMLSpanElement;
    btnProceedCheckout = document.getElementById('btn-proceed-checkout') as HTMLButtonElement;
    btnEmptyCart = document.getElementById('btn-empty-cart') as HTMLButtonElement;
    checkoutModal = document.getElementById('checkout-modal') as HTMLDivElement;
    checkoutForm = document.getElementById('checkout-form') as HTMLFormElement;
    btnCancelCheckout = document.getElementById('btn-cancel-checkout') as HTMLButtonElement;
    confirmEmptyModal = document.getElementById('confirm-empty-modal') as HTMLDivElement;
    btnCancelEmpty = document.getElementById('btn-cancel-empty') as HTMLButtonElement;
    btnConfirmEmpty = document.getElementById('btn-confirm-empty') as HTMLButtonElement;
    // (notificationContainer se asigna dentro de showNotification)

    // 1. Dibuja la página al cargar
    renderPage();

    // 2. Asigna eventos (con chequeo por si son null)
    if (btnProceedCheckout) btnProceedCheckout.addEventListener('click', () => openModal(checkoutModal));
    if (btnEmptyCart) btnEmptyCart.addEventListener('click', () => openModal(confirmEmptyModal));
    if (cartItemsList) cartItemsList.addEventListener('click', handleCartActions);
    if (btnCancelCheckout) btnCancelCheckout.addEventListener('click', () => closeModal(checkoutModal));
    if (checkoutForm) checkoutForm.addEventListener('submit', obtenerInfoEntrega);

    if (btnCancelEmpty) btnCancelEmpty.addEventListener('click', () => closeModal(confirmEmptyModal));
    if (btnConfirmEmpty) btnConfirmEmpty.addEventListener('click', () => {
        clearCart();
        renderPage();
        closeModal(confirmEmptyModal);
        showNotification('El carrito se ha vaciado.', 'success');
    });

    [checkoutModal, confirmEmptyModal].forEach(modal => {
        if (modal) { // Chequeo de nulidad
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });
});