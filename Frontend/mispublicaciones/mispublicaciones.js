// Conectar al servidor
connect2Server(3000);

const Botonvolver = document.getElementById("botonvolver");
const Botonagregar = document.getElementById("botonagregar");
const botonNotificaciones = document.getElementById("botonnotificaciones");
const botonPerfil = document.getElementById("botonperfil");
const botonHome = document.getElementById("botonhome");

Botonvolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

Botonagregar.addEventListener("click", function() {
    window.location.href = "../publicar/publicar.html";
});

botonNotificaciones.addEventListener("click", function() {
    window.location.href = "../notificaciones/notificaciones.html";
});

botonPerfil.addEventListener("click", function() {
    window.location.href = "../perfil/perfil.html";
});

botonHome.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

// Cargar publicaciones del usuario
async function cargarPublicaciones() {
    try {
        // Obtener usuario actual
        const usuarioActual = localStorage.getItem("usuarioActual");
        if (!usuarioActual) {
            alert("Debes iniciar sesión primero");
            window.location.href = "../login/login.html";
            return;
        }

        const usuario = JSON.parse(usuarioActual);
        
        // Obtener publicaciones del usuario desde el backend
        postEvent("obtenerMisPublicaciones", { mailUsuario: usuario.mail }, function(response) {
            if (response.libros) {
                mostrarPublicaciones(response.libros);
            } else {
                console.log("No se pudieron cargar las publicaciones");
            }
        });
    } catch (error) {
        console.error("Error al cargar publicaciones:", error);
    }
}

function mostrarPublicaciones(libros) {
    const contenedor = document.querySelector(".grid-publicaciones");
    
    // Limpiar publicaciones anteriores (mantener el botón de agregar)
    const botonAgregar = document.getElementById("botonagregar");
    contenedor.innerHTML = "";
    contenedor.appendChild(botonAgregar);
    
    // Agregar cada libro como una card
    libros.forEach(libro => {
        const card = document.createElement("div");
        card.className = "card";
        
        const imagenSrc = libro.foto && libro.foto !== 'sin-foto.jpg' ? libro.foto : '../img/libro-placeholder.png';
        
        card.innerHTML = `
            <div class="card-wrapper">
                <div class="card-inner">
                    <img src="${imagenSrc}" alt="${libro.libro}" class="card-imagen" onerror="this.src='../img/libro-placeholder.png'">
                </div>
            </div>
            <div class="card-precio">$${libro.precio}</div>
            <button class="btn-eliminar" data-id="${libro.id}">
                <svg viewBox="0 0 48 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 15.5L9 56.5C9 58.7091 10.7909 60.5 13 60.5H35C37.2091 60.5 39 58.7091 39 56.5L42 15.5M1.5 9.5H46.5M15 9.5V4.5C15 2.29086 16.7909 0.5 19 0.5H29C31.2091 0.5 33 2.29086 33 4.5V9.5M18 23.5V48.5M30 23.5V48.5" 
                    stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        contenedor.appendChild(card);
    });
    
    // Agregar eventos a los botones de eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", function() {
            const idLibro = parseInt(this.getAttribute("data-id"));
            eliminarLibro(idLibro);
        });
    });
}

function eliminarLibro(idLibro) {
    const usuarioActual = localStorage.getItem("usuarioActual");
    const usuario = JSON.parse(usuarioActual);
    
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
        postEvent("borrarLibro", { id: idLibro, mailUsuario: usuario.mail }, function(response) {
            if (response.mensaje) {
                alert(response.mensaje);
                cargarPublicaciones(); // Recargar la lista
            } else if (response.error) {
                alert(response.error);
            }
        });
    }
}

// Cargar publicaciones al iniciar la página
cargarPublicaciones();