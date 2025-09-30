const botonAño = document.getElementById("botonaño");
const botonMateria = document.getElementById("botonmateria");
const botonVolver = document.getElementById("botonvolver");



botonAño.addEventListener("click", function() {
    window.location.href = "../filtroaño/filtroaño.html";
});

botonMateria.addEventListener("click", function() {
    window.location.href = "../filtromateria/filtromateria.html";
});

botonVolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});