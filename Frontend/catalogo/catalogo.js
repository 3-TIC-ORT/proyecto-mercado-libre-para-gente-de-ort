// Conectar al servidor
connect2Server(3000);

// Variables globales
let todosLosLibros = [];
let librosFiltrados = [];

// Obtener elementos del DOM
const productGrid = document.querySelector(".product-grid");
const filterTitle = document.getElementById("filterTitle");
const buscador = document.getElementById("buscador");
const botonNotificaciones = document.getElementById("botonnotificaciones");
const botonPerfil = document.getElementById("botonperfil");
const botonHome = document.getElementById("botonhome");
const botonVolver = document.getElementById("botonvolver");

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

botonVolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

// Búsqueda en tiempo real
buscador.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const terminoBusqueda = buscador.value.trim();
        if (terminoBusqueda !== "") {
            // Cambiar el título a "Resultados de búsqueda"
            filterTitle.textContent = `Resultados de búsqueda`;
        }
        buscarLibros();
    }
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
    const terminoBusqueda = localStorage.getItem("terminoBusqueda");

    // Actualizar título dinámicamente
    if (materiaFiltro) {
        filterTitle.textContent = materiaFiltro;
    } else if (añoFiltro) {
        filterTitle.textContent = añoFiltro;
    } else {
        filterTitle.textContent = "Todos los libros";
    }

    // Si hay término de búsqueda, ponerlo en el input
    if (terminoBusqueda) {
        buscador.value = terminoBusqueda;
        localStorage.removeItem("terminoBusqueda");
    }

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

    // Mostrar libros filtrados (o buscados si hay término)
    if (terminoBusqueda) {
        buscarLibros();
    } else {
        mostrarLibros(librosFiltrados);
    }
}

// Función para buscar libros por nombre
function buscarLibros() {
    const terminoBusqueda = buscador.value.toLowerCase().trim();
    
    if (terminoBusqueda === "") {
        // Si no hay búsqueda, mostrar los libros filtrados normalmente
        mostrarLibros(librosFiltrados);
        return;
    }
    
    // Buscar en TODOS los libros, no solo los filtrados
    const librosEncontrados = todosLosLibros.filter(libro => {
        const nombreLibro = libro.libro.toLowerCase();
        // Búsqueda flexible: verifica si el nombre contiene el término
        return nombreLibro.includes(terminoBusqueda);
    });
    
    mostrarLibros(librosEncontrados);
}

// Función para mostrar libros en el catálogo
function mostrarLibros(libros) {
    // Limpiar el grid
    productGrid.innerHTML = "";

    if (libros.length === 0) {
        mostrarMensaje("No se encontraron libros con los filtros seleccionados");
        return;
    }

    // Crear una tarjeta para cada libro
    libros.forEach(libro => {
        const card = document.createElement("div");
        card.className = "product-card";

        // Determinar la imagen a mostrar
        const imagenSrc = libro.foto && libro.foto !== "sin-foto.jpg" 
            ? libro.foto 
            : "../img/libro-placeholder.png";

        // Construir contenido con la nueva estructura de mispublicaciones
        card.innerHTML = `
            <div class="card-wrapper">
                <div class="card-inner">
                    <img class="card-imagen" src="${imagenSrc}" alt="${libro.libro}" onerror="this.src='../img/libro-placeholder.png'">
                </div>
                <div class="card-precio">$${libro.precio}</div>
            </div>
        `;

        // Hacer la tarjeta clicable
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
    const datosUsuarioStr = localStorage.getItem("datosUsuario");
    
    if (!datosUsuarioStr) {
        alert("Debes iniciar sesión para pedir un libro");
        window.location.href = "../login/login.html";
        return;
    }

    const usuario = JSON.parse(datosUsuarioStr);
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