// Conectar al servidor
connect2Server(3000);

const botonVolver = document.getElementById("botonvolver");
const botonHome = document.getElementById("botonhome");
const notificacionesLista = document.getElementById("notificacionesLista");
const notifTitle = document.getElementById("notifTitle");

botonVolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

botonHome.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

// Cargar notificaciones al iniciar
window.addEventListener("DOMContentLoaded", function() {
    cargarNotificaciones();
});

// Función para cargar notificaciones del usuario
function cargarNotificaciones() {
    const usuarioActual = localStorage.getItem("usuarioActual");
    
    if (!usuarioActual) {
        notificacionesLista.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>Debes iniciar sesión para ver tus notificaciones</h3>
                <button onclick="window.location.href='../login/login.html'" 
                        style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
                    Ir a Login
                </button>
            </div>
        `;
        return;
    }

    const datosUsuarioStr = localStorage.getItem("datosUsuario");
    if (!datosUsuarioStr) {
        window.location.href = "../login/login.html";
        return;
    }
    
    const usuario = JSON.parse(datosUsuarioStr);

    postEvent("obtenerNotificaciones", {
        mailUsuario: usuario.mail
    }, function(respuesta) {
        if (respuesta.notificaciones) {
            // Cargar fotos de perfil antes de mostrar notificaciones
            cargarFotosUsuarios(respuesta.notificaciones, usuario.mail);
        } else {
            notificacionesLista.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3>No tienes notificaciones</h3>
                </div>
            `;
        }
    });
}

// Función para cargar fotos de usuarios desde Usuarios.json
async function cargarFotosUsuarios(notificaciones, mailUsuario) {
    try {
        const response = await fetch('../../Backend/Usuarios.json');
        const usuarios = await response.json();
        
        // Agregar fotos a las notificaciones
        notificaciones.forEach(notif => {
            const comprador = usuarios.find(u => u.mail === notif.mailComprador);
            const vendedor = usuarios.find(u => u.mail === notif.mailVendedor);
            
            notif.fotoComprador = comprador && comprador.fotodeperfil ? comprador.fotodeperfil : '../perfil/cuenta 2.png';
            notif.fotoVendedor = vendedor && vendedor.fotodeperfil ? vendedor.fotodeperfil : '../perfil/cuenta 2.png';
        });
        
        mostrarNotificaciones(notificaciones, mailUsuario);
    } catch (error) {
        console.error("Error al cargar fotos de usuarios:", error);
        // Mostrar notificaciones sin fotos si falla
        notificaciones.forEach(notif => {
            notif.fotoComprador = '../perfil/cuenta 2.png';
            notif.fotoVendedor = '../perfil/cuenta 2.png';
        });
        mostrarNotificaciones(notificaciones, mailUsuario);
    }
}

// Función para mostrar las notificaciones
function mostrarNotificaciones(notificaciones, mailUsuario) {
    if (notificaciones.length === 0) {
        notificacionesLista.innerHTML = `
            <div class="mensaje-vacio">
                <h3>No tienes notificaciones</h3>
            </div>
        `;
        notifTitle.textContent = "0 notificaciones";
        return;
    }

    // Contar notificaciones pendientes
    const pendientes = notificaciones.filter(n => n.estado === "pendiente" && n.mailVendedor === mailUsuario).length;
    notifTitle.textContent = `${pendientes} notificacion${pendientes !== 1 ? 'es' : ''}`;

    notificacionesLista.innerHTML = "";

    notificaciones.forEach(notif => {
        const card = document.createElement("div");
        
        // Determinar si el usuario es el vendedor
        const esVendedor = notif.mailVendedor === mailUsuario;
        
        let contenidoHTML = "";
        let claseEstado = "";

        if (notif.tipo === "pedido" && esVendedor) {
            // Notificación de pedido recibido (para vendedor)
            const fotoComprador = notif.fotoComprador || '../perfil/cuenta 2.png';
            
            if (notif.estado === "pendiente") {
                claseEstado = "pendiente";
                contenidoHTML = `
                    <img src="${fotoComprador}" alt="${notif.nombreComprador}" class="notif-avatar" onerror="this.src='../perfil/cuenta 2.png'">
                    <div class="notif-content">
                        <h3 class="notif-nombre">${notif.nombreComprador}</h3>
                        <p class="notif-mensaje">Está interesado en un libro.</p>
                    </div>
                    <div class="notif-acciones">
                        <button class="btn-aceptar" onclick="aceptarPedido(${notif.id})">Aceptar</button>
                        <button class="btn-rechazar" onclick="rechazarPedido(${notif.id})">Rechazar</button>
                    </div>
                `;
            } else if (notif.estado === "aceptado") {
                claseEstado = "aceptada";
                contenidoHTML = `
                    <img src="${fotoComprador}" alt="${notif.nombreComprador}" class="notif-avatar" onerror="this.src='../perfil/cuenta 2.png'">
                    <div class="notif-content">
                        <h3 class="notif-nombre">${notif.nombreComprador}</h3>
                        <p class="notif-mensaje">Pedido aceptado - "${notif.libroNombre}"</p>
                    </div>
                `;
            } else if (notif.estado === "rechazado") {
                claseEstado = "rechazada";
                contenidoHTML = `
                    <img src="${fotoComprador}" alt="${notif.nombreComprador}" class="notif-avatar" onerror="this.src='../perfil/cuenta 2.png'">
                    <div class="notif-content">
                        <h3 class="notif-nombre">${notif.nombreComprador}</h3>
                        <p class="notif-mensaje">Pedido rechazado - "${notif.libroNombre}"</p>
                    </div>
                `;
            }
        } else if (notif.tipo === "respuesta" && !esVendedor) {
            // Notificación de respuesta (para comprador)
            const fotoVendedor = notif.fotoVendedor || '../perfil/cuenta 2.png';
            
            if (notif.estado === "aceptado") {
                claseEstado = "aceptada";
                contenidoHTML = `
                    <img src="${fotoVendedor}" alt="${notif.nombreVendedor}" class="notif-avatar" onerror="this.src='../perfil/cuenta 2.png'">
                    <div class="notif-content">
                        <h3 class="notif-nombre">${notif.nombreVendedor}</h3>
                        <p class="notif-mensaje">Aceptó tu pedido - "${notif.libroNombre}"</p>
                    </div>
                `;
            } else if (notif.estado === "rechazado") {
                claseEstado = "rechazada";
                contenidoHTML = `
                    <img src="${fotoVendedor}" alt="${notif.nombreVendedor}" class="notif-avatar" onerror="this.src='../perfil/cuenta 2.png'">
                    <div class="notif-content">
                        <h3 class="notif-nombre">${notif.nombreVendedor}</h3>
                        <p class="notif-mensaje">Rechazó tu pedido - "${notif.libroNombre}"</p>
                    </div>
                `;
            }
        }

        card.className = `notificacion-card ${claseEstado}`;
        card.innerHTML = contenidoHTML;
        notificacionesLista.appendChild(card);
    });
}

// Función para aceptar un pedido
function aceptarPedido(idNotificacion) {
    if (!confirm("¿Estás seguro de aceptar este pedido? El libro se eliminará del catálogo.")) {
        return;
    }

    postEvent("aceptarPedido", {
        idNotificacion: idNotificacion
    }, function(respuesta) {
        if (respuesta.error) {
            alert("Error: " + respuesta.error);
        } else {
            alert("¡Pedido aceptado! Se notificará al comprador.");
            cargarNotificaciones(); // Recargar notificaciones
        }
    });
}

// Función para rechazar un pedido
function rechazarPedido(idNotificacion) {
    if (!confirm("¿Estás seguro de rechazar este pedido?")) {
        return;
    }

    postEvent("rechazarPedido", {
        idNotificacion: idNotificacion
    }, function(respuesta) {
        if (respuesta.error) {
            alert("Error: " + respuesta.error);
        } else {
            alert("Pedido rechazado. Se notificará al comprador.");
            cargarNotificaciones(); // Recargar notificaciones
        }
    });
}

// Función auxiliar para formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diferencia = ahora - fecha;
    
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);
    
    if (minutos < 1) return "Hace un momento";
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    
    return fecha.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}