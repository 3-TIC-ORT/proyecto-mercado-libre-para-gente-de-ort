connect2Server(3000);

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

const botonVolver = document.getElementById("botonvolver");

botonVolver.addEventListener("click", function() {
    window.location.href = "../quefiltro/quefiltro.html"; 
});

const boton7MO = document.getElementById("boton7mo");

boton7MO.addEventListener("click", function() {
    localStorage.setItem("filtroAño", "7°");
    window.location.href = "../catalogo/catalogo.html";
});

const boton1RO = document.getElementById("boton1ero");

boton1RO.addEventListener("click", function() {
    localStorage.setItem("filtroAño", "1°");
    window.location.href = "../catalogo/catalogo.html";
});

const boton2DO = document.getElementById("boton2do");

boton2DO.addEventListener("click", function() {
    localStorage.setItem("filtroAño", "2°");
    window.location.href = "../catalogo/catalogo.html";
});

const boton3RO = document.getElementById("boton3ro");

boton3RO.addEventListener("click", function() {
    localStorage.setItem("filtroAño", "3°");
    window.location.href = "../catalogo/catalogo.html";
});

const boton4TO = document.getElementById("boton4to");

boton4TO.addEventListener("click", function() {
    localStorage.setItem("filtroAño", "4°");
    window.location.href = "../catalogo/catalogo.html";
});

const boton5TO = document.getElementById("boton5to");

boton5TO.addEventListener("click", function() {
    localStorage.setItem("filtroAño", "5°");
    window.location.href = "../catalogo/catalogo.html";
});

const botonNotificaciones = document.getElementById("botonnotificaciones");

botonNotificaciones.addEventListener("click", function() {
    window.location.href = "../notificaciones/notificaciones.html"
});