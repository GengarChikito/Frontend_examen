# 🕹️ Frontend - Level-Up Gamer POS

Interfaz de usuario moderna con estilo **Cyberpunk/Gamer** para la tienda "Level-Up Gamer". Desarrollada con React y TailwindCSS, enfocada en la experiencia de usuario y la identidad visual de la marca.

## 🚀 Tecnologías

* **Core:** React 19 + Vite
* **Estilos:** Tailwind CSS v4 (Modo Oscuro Nativo)
* **Routing:** React Router DOM v7
* **HTTP:** Axios
* **Iconografía:** Emojis & Fuentes Google (Orbitron/Roboto)

## 🎨 Características de Diseño & UX

* **Tema Gamer:** Interfaz oscura (`#050505`) con acentos en **Verde Neón** (`#39FF14`) y **Azul Eléctrico** (`#1E90FF`).
* **Responsive:** Adaptable a diferentes tamaños de pantalla.
* **Fuentes:** Uso de *Orbitron* para títulos futuristas y *Roboto* para legibilidad.

## 🔥 Funcionalidades Implementadas

### 🛍️ Punto de Venta (Dashboard)
* **Catálogo Interactivo:** Tarjetas de productos con efectos hover y zoom.
* **Filtros:** Navegación rápida por categorías (Consolas, Accesorios, Ropa, etc.).
* **Carrito Inteligente:** Cálculos en tiempo real, validación de stock y desglose de precios.

### 👤 Gestión de Usuarios
* **Login/Registro Unificado:** Formulario dual con validación de edad y registro de nuevos clientes.
* **Roles:** Vistas diferenciadas para **Admin** (Gestión) y **Cliente** (Compra).

### 📜 Historial & Reseñas
* **Boleta Digital:** Visualización detallada de compras pasadas con desglose de **Descuento Duoc** e IVA.
* **Sistema de Feedback:** Posibilidad de calificar productos directamente desde la boleta.
* **Muro de Reseñas:** Página dedicada para ver las opiniones de la comunidad.

---

## 🛠️ Instalación

1.  **Requisitos:**
    Tener el Backend corriendo en el puerto `4000`.

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar Proyecto:**
    ```bash
    npm run dev
    ```
    Visita: `http://localhost:5173`

## 🔑 Credenciales de Prueba (Seed)

* **Administrador:** `admin@tienda.cl` | `123`
* **Cliente Duoc (Descuento):** `juan@duoc.cl` | `123`