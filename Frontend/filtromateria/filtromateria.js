// Conectar al servidor
connect2Server(3000);

const buscador = document.getElementById("buscador");

// Funcionalidad de búsqueda
buscador.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const terminoBusqueda = buscador.value.trim();
        if (terminoBusqueda !== "") {
            localStorage.setItem("terminoBusqueda", terminoBusqueda);
            window.location.href = "../catalogo/catalogo.html";
        }
    }
});

const botonCJ = document.getElementById("botoncj");

botonCJ.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Cultura judía");
    window.location.href = "../catalogo/catalogo.html";
});

const botonBIO = document.getElementById("botonbio");

botonBIO.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Biología");
    window.location.href = "../catalogo/catalogo.html";
});

const botonED = document.getElementById("botoned");

botonED.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Educación Judía");
    window.location.href = "../catalogo/catalogo.html";
});

const botonEC = document.getElementById("botonec");

botonEC.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Formación ética y ciudadana");
    window.location.href = "../catalogo/catalogo.html";
});

const botonGEO = document.getElementById("botongeo");

botonGEO.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Geografía");
    window.location.href = "../catalogo/catalogo.html";
});

const botonHIS = document.getElementById("botonhis");

botonHIS.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Historia");
    window.location.href = "../catalogo/catalogo.html";
});

const botonLL = document.getElementById("botonll");

botonLL.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Lengua y literatura");
    window.location.href = "../catalogo/catalogo.html";
});

const botonING = document.getElementById("botoning");

botonING.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Inglés");
    window.location.href = "../catalogo/catalogo.html";
});

const botonHEB = document.getElementById("botonheb");

botonHEB.addEventListener("click", function() {
    localStorage.setItem("filtroMateria", "Hebreo");
    window.location.href = "../catalogo/catalogo.html";
});

const botonNotificaciones = document.getElementById("botonnotificaciones");

botonNotificaciones.addEventListener("click", function() {
    window.location.href = "../notificaciones/notificaciones.html"
});

const botonPerfil = document.getElementById("botonperfil");

botonPerfil.addEventListener("click", function() {
    window.location.href = "../perfil/perfil.html"
});

const botonhome = document.getElementById("botonhome");

botonhome.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html"
});