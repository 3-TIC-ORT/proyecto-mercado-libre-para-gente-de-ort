// Conectar al servidor
connect2Server(3000);

const Botonvolver = document.getElementById("botonvolver");
const Botonagregar = document.getElementById("botonagregar");

Botonvolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

Botonagregar.addEventListener("click", function() {
    window.location.href = "../publicar/publicar.html";
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
        card.innerHTML = `
            <img src="${libro.foto}" alt="${libro.libro}" class="card-imagen">
            <div class="card-info">
                <h3 class="card-titulo">${libro.libro}</h3>
                <p class="card-detalle">Materia: ${libro.materia}</p>
                <p class="card-detalle">Año: ${libro.año}</p>
                <p class="card-detalle">Sede: ${libro.sede}</p>
                <button class="btn-eliminar" data-id="${libro.id}">Eliminar</button>
            </div>
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