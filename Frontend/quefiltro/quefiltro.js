const botonAño = document.getElementById("botonaño");
const botonMateria = document.getElementById("botonmateria");
const botonVolver = document.getElementById("botonvolver");
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



botonAño.addEventListener("click", function() {
    window.location.href = "../filtroaño/filtroaño.html";
});

botonMateria.addEventListener("click", function() {
    window.location.href = "../filtromateria/filtromateria.html";
});

botonVolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});