connect2Server(3000);

let todosLosLibros = [];
let librosFiltrados = [];

const productGrid = document.querySelector(".product-grid");
const filterTitle = document.getElementById("filterTitle");
const buscador = document.getElementById("buscador");
const botonNotificaciones = document.getElementById("botonnotificaciones");
const botonPerfil = document.getElementById("botonperfil");
const botonHome = document.getElementById("botonhome");
const botonVolver = document.getElementById("botonvolver");

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

buscador.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const terminoBusqueda = buscador.value.trim();
        if (terminoBusqueda !== "") {

            filterTitle.textContent = `Resultados de búsqueda`;
        }
        buscarLibros();
    }
});

window.addEventListener("DOMContentLoaded", function() {
    cargarLibros();
});

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

function aplicarFiltros() {
    const añoFiltro = localStorage.getItem("filtroAño");
    const materiaFiltro = localStorage.getItem("filtroMateria");
    const terminoBusqueda = localStorage.getItem("terminoBusqueda");

    if (materiaFiltro) {
        filterTitle.textContent = materiaFiltro;
    } else if (añoFiltro) {
        filterTitle.textContent = añoFiltro;
    } else {
        filterTitle.textContent = "Todos los libros";
    }

    if (terminoBusqueda) {
        buscador.value = terminoBusqueda;
        localStorage.removeItem("terminoBusqueda");
    }

    localStorage.removeItem("filtroAño");
    localStorage.removeItem("filtroMateria");

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

    if (terminoBusqueda) {
        buscarLibros();
    } else {
        mostrarLibros(librosFiltrados);
    }
}

function buscarLibros() {
    const terminoBusqueda = buscador.value.toLowerCase().trim();
    
    if (terminoBusqueda === "") {
        mostrarLibros(librosFiltrados);
        return;
    }
    
    const librosEncontrados = todosLosLibros.filter(libro => {
        const nombreLibro = libro.libro.toLowerCase();

        return nombreLibro.includes(terminoBusqueda);
    });
    
    mostrarLibros(librosEncontrados);
}

function mostrarLibros(libros) {

    productGrid.innerHTML = "";

    if (libros.length === 0) {
        mostrarMensaje("No se encontraron libros con los filtros seleccionados");
        return;
    }

    libros.forEach(libro => {
        const card = document.createElement("div");
        card.className = "product-card";

        const imagenSrc = libro.foto && libro.foto !== "sin-foto.jpg" 
            ? libro.foto 
            : "../img/libro-placeholder.png";

        card.innerHTML = `
            <div class="card-wrapper">
                <div class="card-inner">
                    <img class="card-imagen" src="${imagenSrc}" alt="${libro.libro}" onerror="this.src='../img/libro-placeholder.png'">
                </div>
                <div class="card-precio">$${libro.precio}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `infoLibro.html?id=${libro.id}`;
        });

        productGrid.appendChild(card);
    });
}

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

function pedirLibro(idLibro) {

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


    if (libro.mailVendedor === usuario.mail) {
        alert("No puedes pedir tu propio libro");
        return;
    }


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