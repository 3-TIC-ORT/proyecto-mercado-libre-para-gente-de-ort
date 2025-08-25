const botonLogin = document.getElementById("botonlogin");
const botonRegistro = document.getElementById("botonregistro");


botonLogin.addEventListener("click", function() {
    window.location.href = "../login/login.html";
});

botonRegistro.addEventListener("click", function() {
    window.location.href = "../registro/registro.html";
});