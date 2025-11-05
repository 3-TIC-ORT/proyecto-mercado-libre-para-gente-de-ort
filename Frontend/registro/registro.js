const botonVolver = document.getElementById("botonvolver");
const botonEntrar = document.getElementById("botonentrar");

connect2Server(3000);

botonVolver.addEventListener("click", function() {
  window.location.href = "../inicio/index.html";
});

botonEntrar.addEventListener("click", function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const usuario = document.getElementById("usuario").value;
  const contraseña = document.getElementById("contraseña").value;
  const repcontraseña = document.getElementById("repcontraseña").value;
  const genero = document.querySelector('input[name="genero"]:checked')?.value;
  const sede = document.querySelector('input[name="sede"]:checked')?.value;

  if (!nombre || !apellido || !usuario || !contraseña || !repcontraseña || !genero || !sede) {
    alert("Por favor, complete todos los campos");
    return;
  }

  if (contraseña !== repcontraseña) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const userData = { nombre, apellido, usuario, contraseña, genero, sede };

  postEvent("registrarUsuario", userData, function(response) {
    console.log("Respuesta del servidor:", response);
    if (response.success) {
      alert(response.message);
      window.location.href = "../compraoventa/compraoventa.html";
    } else {
      alert("Error en el registro: " + response.message);
    }
  });
});
