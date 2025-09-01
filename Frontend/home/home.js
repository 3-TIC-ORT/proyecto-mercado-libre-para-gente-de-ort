const botonPerfil = document.getElementById("botonperfil");
const botonCatalogo = document.getElementById("botoncatalogo");
const botonPedidos = document.getElementById("botonpedidos");
const botonNotificaciones = document.getElementById("botonnotificaciones")
const botonCarrito = document.getElementById("botoncarrito")
const botonPublicar = document.getElementById("botonpublicar")





botonPerfil.addEventListener("click", function() {
    window.location.href = "../perfil/perfil.html";
});

botonCatalogo.addEventListener("click", function() {
    window.location.href = "../catalogo/catalogo.html";
});

botonPedidos.addEventListener("click", function() {
    window.location.href = "../pedidos/pedidos.html";
});

botonNotificaciones.addEventListener("click", function() {
    window.location.href = "../notificaciones/notificaciones.html";
});

botonCarrito.addEventListener("click", function() {
    window.location.href = "../carrito/carrito.html";
});

botonPublicar.addEventListener("click", function() {
    window.location.href = "../publicar/publicar.html";
});
