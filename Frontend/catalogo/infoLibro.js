// Conectar al servidor
connect2Server(3000);

// Variables globales
const detalle = document.getElementById('detalle');
const botonNotificaciones = document.getElementById('botonnotificaciones');
const botonPerfil = document.getElementById('botonperfil');
const botonHome = document.getElementById('botonhome');
const botonLogo = document.getElementById('botonlogo');

// Navegación del header
botonNotificaciones.addEventListener('click', function() {
    window.location.href = '../notificaciones/notificaciones.html';
});

botonPerfil.addEventListener('click', function() {
    window.location.href = '../perfil/perfil.html';
});

botonHome.addEventListener('click', function() {
    window.location.href = '../compraoventa/compraoventa.html';
});

botonLogo.addEventListener('click', function() {
    window.location.href = '../compraoventa/compraoventa.html';
});

// Obtener id desde query string
function getQueryParam(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

const id = getQueryParam('id');

if (!id) {
    detalle.innerHTML = '<p>ID de libro no especificado.</p>';
} else {
    // Cargar todos los libros y buscar el que coincide con el id
    postEvent('obtenerTodosLosLibros', {}, function(respuesta){
        if (!respuesta.libros) {
            detalle.innerHTML = '<p>No se pudieron cargar los datos del libro.</p>';
            return;
        }

        const libros = respuesta.libros;
        // Los IDs en backend son números (Date.now()), así que comparar como número
        const libro = libros.find(l => String(l.id) === String(id));

        if (!libro) {
            detalle.innerHTML = '<p>Libro no encontrado.</p>';
            return;
        }

        // Obtener foto de perfil del vendedor desde el backend
        obtenerFotoVendedor(libro);
    });
}

function obtenerFotoVendedor(libro) {
    // Solicitar información del vendedor al backend
    postEvent('obtenerUsuario', { mail: libro.mailVendedor }, function(response) {
        let fotoVendedor = '../perfil/cuenta 2.png'; // Foto por defecto
        
        if (response.usuario && response.usuario.fotodeperfil) {
            fotoVendedor = response.usuario.fotodeperfil;
        }
        
        renderizarDetalle(libro, fotoVendedor);
    });
}

function renderizarDetalle(libro, fotoVendedor){
    const imagenSrc = libro.foto && libro.foto !== 'sin-foto.jpg' ? libro.foto : '../img/libro-placeholder.png';
    
    // Usar la foto del vendedor pasada como parámetro o la por defecto
    const fotoPerfilSrc = fotoVendedor || '../perfil/cuenta 2.png';

    detalle.innerHTML = `
        <div class="portada-container">
            <img src="${imagenSrc}" alt="${libro.libro}" class="portada" onerror="this.src='../img/libro-placeholder.png'">
        </div>
        <div class="info-derecha">
            <h1 class="titulo-libro">${libro.libro}</h1>
            <div class="precio-libro">$${libro.precio}</div>
            
            <div class="publicado-por-container">
                <p class="publicado-por">Publicado por</p>
                <div class="vendedor-info">
                    <img src="${fotoPerfilSrc}" alt="${libro.nombreVendedor}" class="avatar-vendedor" onerror="this.src='../perfil/cuenta 2.png'">
                    <span class="nombre-vendedor">${libro.nombreVendedor}</span>
                </div>
            </div>
            
            <div class="campo-info">Aula: ${libro.aula || 'L120'}</div>
            
            <button id="botonPedir" class="boton-pedir">PEDIR</button>
        </div>
    `;

    const botonPedir = document.getElementById('botonPedir');
    botonPedir.addEventListener('click', () => pedirLibroDetalle(libro.id, libro.mailVendedor, libro.nombreVendedor, libro.libro));

    // Deshabilitar si el usuario es el propio vendedor
    const datosUsuarioStr = localStorage.getItem('datosUsuario');
    if (datosUsuarioStr){
        const usuario = JSON.parse(datosUsuarioStr);
        if (usuario.mail === libro.mailVendedor){
            botonPedir.disabled = true;
            botonPedir.textContent = 'Es tu publicación';
        }
    }
}

function pedirLibroDetalle(idLibro, mailVendedor, nombreVendedor, nombreLibro){
    const datosUsuarioStr = localStorage.getItem('datosUsuario');
    if (!datosUsuarioStr){
        alert('Debes iniciar sesión para pedir un libro');
        window.location.href = '../login/login.html';
        return;
    }

    const usuario = JSON.parse(datosUsuarioStr);

    // Prevenir pedir el propio libro
    if (usuario.mail === mailVendedor){
        alert('No puedes pedir tu propio libro');
        return;
    }

    postEvent('pedirLibro', {
        idLibro: idLibro,
        mailComprador: usuario.mail,
        nombreComprador: usuario.nombre
    }, function(respuesta){
        if (respuesta.error){
            alert('Error al enviar pedido: ' + respuesta.error);
        } else {
            alert(`¡Pedido enviado! ${nombreVendedor} recibirá una notificación con tu solicitud.`);
            // Opcional: volver al catálogo
            // window.location.href = 'catalogo.html';
        }
    });
}
