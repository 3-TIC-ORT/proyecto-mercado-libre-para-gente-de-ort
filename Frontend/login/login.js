// Conectar al servidor
connect2Server(3000);

const botonVolver = document.getElementById("botonvolver");
const botonEntrar = document.getElementById("botonentrar");

botonVolver.addEventListener("click", function() {
    window.location.href = "../inicio/index.html";
});

botonEntrar.addEventListener("click", function(event) {
    event.preventDefault();
    
    // Obtener los VALORES de los inputs
    const usuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;

    // Validar que no estén vacíos
    if (!usuario || !contraseña) {
        alert("Por favor, complete todos los campos");
        return;
    }

    // Crear objeto con los datos (los nombres deben coincidir con el backend)
    const userData = { 
        mail: usuario,      // El backend espera 'mail'
        password: contraseña // El backend espera 'password'
    };

    // Enviar al backend
    postEvent("loginUsuario", userData, function(response) {
        console.log("Respuesta del servidor:", response);
        console.log("Mensaje:", response.mensaje);
        console.log("Usuario:", response.usuario);
        
        // El backend devuelve 'mensaje' si está ok o 'error' si falla
        if (response.mensaje && response.usuario) {
            // Guardar los datos del usuario en localStorage
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