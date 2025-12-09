connect2Server(3000);

const botonVolver = document.getElementById("botonvolver");
const botonEntrar = document.getElementById("botonentrar");

botonVolver.addEventListener("click", function() {
  window.location.href = "../inicio/index.html";
});

botonEntrar.addEventListener("click", function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const mail = document.getElementById("mail").value;
  const contraseña = document.getElementById("contraseña").value;
  const genero = document.querySelector('input[name="genero"]:checked')?.value;
  const sede = document.querySelector('input[name="sede"]:checked')?.value;

  console.log("Datos capturados:", { nombre, apellido, mail, contraseña, genero, sede });

  if (!nombre || !apellido || !mail || !contraseña || !genero || !sede) {
    alert("Por favor, complete todos los campos");
    return;
  }

  if (!mail.includes("@")) {
    alert("El email debe contener un @");
    return;
  }

  const userData = { 
    nombre: nombre,
    apellido: apellido,
    mail: mail,
    contraseña: contraseña,
    genero: genero,
    sede: sede,
    fotodeperfil: null
  };

  console.log("Enviando datos al backend:", userData);

  postEvent("registrarUsuario", userData, function(response) {
    console.log("Respuesta del servidor:", response);
    
    if (response.mensaje) {
      alert("Usuario registrado exitosamente");
      window.location.href = "../login/login.html";
    } else if (response.error) {
      alert("Error en el registro: " + response.error);
    } else {
      alert("Error desconocido en el registro");
    }
  });
});