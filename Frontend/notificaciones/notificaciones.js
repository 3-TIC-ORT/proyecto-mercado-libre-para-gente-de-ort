// Conectar al servidor
connect2Server(3000);

const botonVolver = document.getElementById("botonvolver");
const notificacionesLista = document.getElementById("notificacionesLista");

botonVolver.addEventListener("click", function() {
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

    const usuario = JSON.parse(usuarioActual);

    postEvent("obtenerNotificaciones", {
        mailUsuario: usuario.mail
    }, function(respuesta) {
        if (respuesta.notificaciones) {
            mostrarNotificaciones(respuesta.notificaciones, usuario.mail);
        } else {
            notificacionesLista.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3>No tienes notificaciones</h3>
                </div>
            `;
        }
    });
}

// Función para mostrar las notificaciones
function mostrarNotificaciones(notificaciones, mailUsuario) {
    if (notificaciones.length === 0) {
        notificacionesLista.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>No tienes notificaciones</h3>
            </div>
        `;
        return;
    }

    notificacionesLista.innerHTML = "";

    notificaciones.forEach(notif => {
        const card = document.createElement("div");
        card.className = "notificacion-card";
        
        // Determinar si el usuario es el vendedor o comprador
        const esVendedor = notif.mailVendedor === mailUsuario;
        
        // Determinar el estilo según el tipo y estado
        let estadoClase = "";
        let contenidoHTML = "";

        if (notif.tipo === "pedido" && esVendedor) {
            // Notificación de pedido recibido (para vendedor)
            if (notif.estado === "pendiente") {
                estadoClase = "pendiente";
                contenidoHTML = `
                    <div class="notif-header">
                        <span class="notif-icono">📬</span>
                        <span class="notif-titulo">Nuevo Pedido</span>
                        <span class="notif-estado estado-pendiente">Pendiente</span>
                    </div>
                    <div class="notif-body">
                        <p><strong>${notif.nombreComprador}</strong> está interesado en tu libro:</p>
                        <p class="notif-libro">"${notif.libroNombre}"</p>
                        <p class="notif-fecha">${formatearFecha(notif.fecha)}</p>
                    </div>
                    <div class="notif-acciones">
                        <button class="btn-aceptar" onclick="aceptarPedido(${notif.id})">✓ Aceptar</button>
                        <button class="btn-rechazar" onclick="rechazarPedido(${notif.id})">✗ Rechazar</button>
                    </div>
                `;
            } else if (notif.estado === "aceptado") {
                estadoClase = "aceptado";
                contenidoHTML = `
                    <div class="notif-header">
                        <span class="notif-icono">✅</span>
                        <span class="notif-titulo">Pedido Aceptado</span>
                        <span class="notif-estado estado-aceptado">Aceptado</span>
                    </div>
                    <div class="notif-body">
                        <p>Aceptaste el pedido de <strong>${notif.nombreComprador}</strong></p>
                        <p class="notif-libro">"${notif.libroNombre}"</p>
                        <p class="notif-fecha">${formatearFecha(notif.fecha)}</p>
                    </div>
                `;
            } else if (notif.estado === "rechazado") {
                estadoClase = "rechazado";
                contenidoHTML = `
                    <div class="notif-header">
                        <span class="notif-icono">❌</span>
                        <span class="notif-titulo">Pedido Rechazado</span>
                        <span class="notif-estado estado-rechazado">Rechazado</span>
                    </div>
                    <div class="notif-body">
                        <p>Rechazaste el pedido de <strong>${notif.nombreComprador}</strong></p>
                        <p class="notif-libro">"${notif.libroNombre}"</p>
                        <p class="notif-fecha">${formatearFecha(notif.fecha)}</p>
                    </div>
                `;
            }
        } else if (notif.tipo === "respuesta" && !esVendedor) {
            // Notificación de respuesta (para comprador)
            if (notif.estado === "aceptado") {
                estadoClase = "aceptado";
                contenidoHTML = `
                    <div class="notif-header">
                        <span class="notif-icono">🎉</span>
                        <span class="notif-titulo">¡Pedido Aceptado!</span>
                        <span class="notif-estado estado-aceptado">Aceptado</span>
                    </div>
                    <div class="notif-body">
                        <p>${notif.mensaje}</p>
                        <p class="notif-fecha">${formatearFecha(notif.fecha)}</p>
                    </div>
                `;
            } else if (notif.estado === "rechazado") {
                estadoClase = "rechazado";
                contenidoHTML = `
                    <div class="notif-header">
                        <span class="notif-icono">😔</span>
                        <span class="notif-titulo">Pedido Rechazado</span>
                        <span class="notif-estado estado-rechazado">Rechazado</span>
                    </div>
                    <div class="notif-body">
                        <p>${notif.mensaje}</p>
                        <p class="notif-fecha">${formatearFecha(notif.fecha)}</p>
                    </div>
                `;
            }
        }

        card.className = `notificacion-card ${estadoClase}`;
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