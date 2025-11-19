// Conectar al servidor
connect2Server(3000);

// Variables globales
let todosLosLibros = [];
let librosFiltrados = [];

// Obtener elementos del DOM
const productGrid = document.querySelector(".product-grid");
const botonNotificaciones = document.getElementById("botonnotificaciones");
const botonPerfil = document.getElementById("botonperfil");
const botonHome = document.getElementById("botonhome");

// Navegación
botonNotificaciones.addEventListener("click", function() {
    window.location.href = "../notificaciones/notificaciones.html";
});

botonPerfil.addEventListener("click", function() {
    window.location.href = "../perfil/perfil.html";
});

botonHome.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

// Cargar libros al iniciar
window.addEventListener("DOMContentLoaded", function() {
    cargarLibros();
});

// Función para cargar todos los libros desde el backend
function cargarLibros() {
    postEvent("obtenerTodosLosLibros", {}, function(respuesta) {
        if (respuesta.libros) {
            todosLosLibros = respuesta.libros;
            aplicarFiltros();
        } else {
            console.error("No se pudieron cargar los libros");
            mostrarMensaje("No hay libros disponibles");
        }
    });
}

// Función para aplicar filtros desde localStorage
function aplicarFiltros() {
    // Obtener filtros guardados
    const añoFiltro = localStorage.getItem("filtroAño");
    const materiaFiltro = localStorage.getItem("filtroMateria");

    // Limpiar filtros del localStorage después de usarlos
    localStorage.removeItem("filtroAño");
    localStorage.removeItem("filtroMateria");

    // Filtrar libros
    librosFiltrados = todosLosLibros.filter(libro => {
        let cumpleAño = true;
        let cumpleMateria = true;

        if (añoFiltro) {
            cumpleAño = libro.año === añoFiltro;
        }

        if (materiaFiltro) {
            cumpleMateria = libro.materia.toLowerCase() === materiaFiltro.toLowerCase();
        }

        return cumpleAño && cumpleMateria;
    });

    // Mostrar libros filtrados
    mostrarLibros(librosFiltrados);
}

// Función para mostrar libros en el catálogo
function mostrarLibros(libros) {
    // Limpiar el grid
    productGrid.innerHTML = "";

    if (libros.length === 0) {
        mostrarMensaje("No se encontraron libros con los filtros seleccionados");
        return;
    }

    // Crear una tarjeta para cada libro (ahora la tarjeta es clicable y redirige a la página de detalle)
    libros.forEach(libro => {
        const card = document.createElement("div");
        card.className = "product-card";

        // Determinar la imagen a mostrar
        const imagenSrc = libro.foto && libro.foto !== "sin-foto.jpg" 
            ? libro.foto 
            : "../img/libro-placeholder.png";

        // Construir contenido sin el botón de pedir aquí (el botón estará en la página de detalle)
        card.innerHTML = `
            <img src="${imagenSrc}" alt="${libro.libro}" onerror="this.src='../img/libro-placeholder.png'">
            <h3>${libro.libro}</h3>
            <p>${libro.materia} - ${libro.año}</p>
            <p><strong>Vendedor:</strong> ${libro.nombreVendedor}</p>
            <span class="price">$${libro.precio}</span>
        `;

        // Hacer la tarjeta clicable: ir a infoLibro.html con query param id
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = `infoLibro.html?id=${libro.id}`;
        });

        productGrid.appendChild(card);
    });
}

// Función para mostrar un mensaje cuando no hay libros
function mostrarMensaje(mensaje) {
    productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <h2>${mensaje}</h2>
            <button onclick="window.location.href='../quefiltro/quefiltro.html'" 
                    style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
                Volver a filtros
            </button>
        </div>
    `;
}

// Función para pedir un libro
function pedirLibro(idLibro) {
    // Verificar que el usuario esté logueado
    const usuarioActual = localStorage.getItem("usuarioActual");
    
    if (!usuarioActual) {
        alert("Debes iniciar sesión para pedir un libro");
        window.location.href = "../login/login.html";
        return;
    }

    const usuario = JSON.parse(usuarioActual);
    const libro = todosLosLibros.find(l => l.id === idLibro);
    
    if (!libro) {
        alert("Libro no encontrado");
        return;
    }

    // Verificar que no sea el propio vendedor
    if (libro.mailVendedor === usuario.mail) {
        alert("No puedes pedir tu propio libro");
        return;
    }

    // Enviar pedido al backend
    postEvent("pedirLibro", {
        idLibro: idLibro,
        mailComprador: usuario.mail,
        nombreComprador: usuario.nombre
    }, function(respuesta) {
        if (respuesta.error) {
            alert("Error al enviar pedido: " + respuesta.error);
        } else {
            alert(`¡Pedido enviado! ${libro.nombreVendedor} recibirá una notificación con tu solicitud.`);
        }
    });
}