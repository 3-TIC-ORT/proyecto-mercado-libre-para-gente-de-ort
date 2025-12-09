const usuarioActual = localStorage.getItem("usuarioActual");
console.log("Usuario en sesión:", usuarioActual);

if (!usuarioActual) {
    console.log("No hay sesión activa, redirigiendo al login");
    alert("Debes iniciar sesión primero");
    window.location.href = "../login/login.html";
}

const botonComprar = document.getElementById("botoncomprar");
const botonVender = document.getElementById("botonvender");
const botonVolver = document.getElementById("botonvolver");
const botonNotificaciones = document.getElementById("botonnotificaciones");
const botonPerfil = document.getElementById("botonperfil");
const buscador = document.getElementById("buscador");

buscador.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const terminoBusqueda = buscador.value.trim();
        if (terminoBusqueda !== "") {
            localStorage.setItem("terminoBusqueda", terminoBusqueda);
            window.location.href = "../catalogo/catalogo.html";
        }
    }
});

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