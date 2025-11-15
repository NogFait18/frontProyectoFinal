# frontProyectoFinal

Este es el proyecto final para las materias de programación 3 de la "Tecnicatura Universitaria en Programación".

**Participantes:** Leonardo Gomez, Sebastian Saez, Fausto Chirino y Neyén Bianchi.

##  Food Store - Sistema de Gestión de Pedidos de Comida

Un frontend completo para una aplicación de gestión de un negocio de comidas, desarrollado con `TypeScript`, `Vite`, `HTML5` y `CSS3` puro (sin frameworks). Se conecta a un backend `Spring Boot REST API` para gestionar usuarios, productos, categorías y pedidos.

###  Tecnologías
- **Frontend:** `TypeScript`, `Vite`, `HTML5`, `CSS3`
- **Backend:** `Spring Boot REST API`
- **Autenticación:** Gestión básica con `localStorage` (Sin módulo de seguridad)

---

##  Objetivos del Proyecto
Desarrollar una aplicación web completa que permita:
1.  **A los administradores:** Gestionar categorías, productos y pedidos.
2.  **A los clientes:** Navegar productos, realizar compras y seguir sus pedidos.
3.  **Sistema de carrito:** Funcional con persistencia en `localStorage`.
4.  **Integración con API:** Conexión completa con backend Spring Boot.

---

## 🏗️ Estructura del Proyecto
```bash
FRONTPROYECTOFINAL
├── index.html        # Redirección a login
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración TypeScript
├── vite.config.ts    # Configuración Vite
├── src/
│   ├── main.ts         # Punto de entrada
│   ├── style.css       # Estilos globales
│   │
│   ├── types/          # Definiciones de tipos TypeScript
│   │   ├── ICart.ts
│   │   ├── ICategoria.ts
│   │   ├── IPedido.ts
│   │   ├── IProductos.ts
│   │   └── IUsers.ts
│   │
│   ├── utils/          # Utilidades y helpers
│   │   ├── api.ts        # Funciones de conexión con API
│   │
│   └── pages/          # Páginas de la aplicación
│       ├── auth/
│       │   ├── login/
│       │   └── register/
│       ├── store/
│       │   ├── home/
│       │   ├── productDetail/
│       │   └── cart/
│       └── admin/
│           ├── adminHome/
│           ├── categories/
│           ├── products/
│           └── orders/