const botonComprar = document.getElementById("botoncomprar");
const botonVender = document.getElementById("botonvender");


botonComprar.addEventListener("click", function() {
    window.location.href = "../filtroaño/filtroaño.html";
});

botonVender.addEventListener("click", function() {
    window.location.href = "../publicar/publicar.html";
});