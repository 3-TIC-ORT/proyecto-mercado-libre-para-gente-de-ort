connect2Server(3000);

const botonVolver = document.getElementById("botonvolver");
const botonEntrar = document.getElementById("botonentrar");

botonVolver.addEventListener("click", function() {
    window.location.href = "../inicio/index.html";
});

botonEntrar.addEventListener("click", function(event) {
    event.preventDefault();
    
    const usuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;

    if (!usuario || !contraseña) {
        alert("Por favor, complete todos los campos");
        return;
    }

    const userData = { 
        mail: usuario,     
        password: contraseña 
    };

    postEvent("loginUsuario", userData, function(response) {
        console.log("Respuesta del servidor:", response);
        console.log("Mensaje:", response.mensaje);
        console.log("Usuario:", response.usuario);
        
        if (response.mensaje && response.usuario) {
            localStorage.setItem("datosUsuario", JSON.stringify(response.usuario));
            localStorage.setItem("usuarioActual", response.usuario.mail);
            console.log("Usuario guardado en localStorage:", localStorage.getItem("datosUsuario"));
            alert(response.mensaje);
            window.location.href = "../compraoventa/compraoventa.html";
        } else if (response.error) {
            alert("Error en el login: " + response.error);
        } else {
            console.log("Respuesta inesperada del servidor");
            alert("Respuesta inesperada del servidor");
        }
    });
});