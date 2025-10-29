const botonComprar = document.getElementById("botoncomprar");
const botonVender = document.getElementById("botonvender");
const botonVolver = document.getElementById("botonvolver");
const botonNotificaciones = document.getElementById("botonnotificaciones");
const botonPerfil = document.getElementById("botonperfil")


botonComprar.addEventListener("click", function() {
    window.location.href = "../quefiltro/quefiltro.html";
});

botonVender.addEventListener("click", function() {
    window.location.href = "../mispublicaciones/mispublicaciones.html";
});

botonVolver.addEventListener("click", function() {
    window.location.href = "../inicio/index.html";
});

botonNotificaciones.addEventListener("click", function(){
    window.location.href = "../notificaciones/notificaciones.html"
})

botonPerfil.addEventListener("click", function() {
    window.location.href = "../perfil/perfil.html"
})