// Conectar al servidor SoqueTIC
const con = connect2Server(3000);

// Referencias DOM
const botonHome = document.querySelector("#botonhome");
const botonVolver = document.querySelector("#botonvolver");
const editIcon = document.querySelector("#editIcon");
const inputFoto = document.querySelector("#inputFoto");
const avatarImg = document.querySelector("#avatarImg");
const btnGuardar = document.querySelector("#btnGuardar");
const inputNombre = document.querySelector("#nombre");
const inputApellido = document.querySelector("#apellido");
const inputSede = document.querySelector("#sede");

// Cargar datos del usuario al iniciar
window.addEventListener("DOMContentLoaded", () => {
    cargarDatosUsuario();
});

// Navegación
botonHome.addEventListener("click", () => {
    location.href = "../compraoventa/compraoventa.html";
});

botonVolver.addEventListener("click", () => {
    location.href = "../compraoventa/compraoventa.html";
});

// Activar input de foto al hacer clic en el ícono de edición
editIcon.addEventListener("click", () => {
    inputFoto.click();
});

// Previsualizar foto seleccionada
inputFoto.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Guardar datos del perfil
btnGuardar.addEventListener("click", () => {
    guardarDatosUsuario();
});

function cargarDatosUsuario() {
    const datosUsuarioStr = localStorage.getItem("datosUsuario");
    if (datosUsuarioStr) {
        const datosUsuario = JSON.parse(datosUsuarioStr);
        
        // Completar los inputs con los datos actuales
        inputNombre.value = datosUsuario.nombre || "";
        inputApellido.value = datosUsuario.apellido || "";
        
        // Seleccionar la sede correcta en el select
        if (datosUsuario.sede) {
            // Normalizar el valor para que coincida con las opciones
            const sedeNormalizada = datosUsuario.sede.charAt(0).toUpperCase() + datosUsuario.sede.slice(1).toLowerCase();
            inputSede.value = sedeNormalizada;
            console.log("Sede cargada:", sedeNormalizada);
        } else {
            inputSede.value = "Montañeses"; // Por defecto
        }
        
        // Cargar foto de perfil si existe
        if (datosUsuario.fotodeperfil) {
            avatarImg.src = datosUsuario.fotodeperfil;
        } else {
            avatarImg.src = "cuenta 2.png";
        }
        
        console.log("Datos cargados:", datosUsuario);
    } else {
        console.log("No hay datos de usuario en localStorage");
    }
}

function guardarDatosUsuario() {
    const datosUsuarioStr = localStorage.getItem("datosUsuario");
    if (!datosUsuarioStr) {
        alert("No hay usuario logueado");
        return;
    }
    
    const datosUsuario = JSON.parse(datosUsuarioStr);
    const mailUsuario = datosUsuario.mail;

    console.log("Guardando datos...");

    // Preparar datos actualizados
    const datosActualizados = {
        mail: mailUsuario,
        nombre: inputNombre.value.trim(),
        apellido: inputApellido.value.trim(),
        sede: inputSede.value,
        fotodeperfil: avatarImg.src
    };

    console.log("Datos a enviar:", datosActualizados);

    // Enviar al backend usando postEvent
    postEvent("actualizarPerfil", datosActualizados, (respuesta) => {
        console.log("Respuesta del servidor:", respuesta);
        
        if (respuesta.error) {
            alert("Error: " + respuesta.error);
        } else {
            // Actualizar localStorage con los nuevos datos
            const datosActualizadosCompletos = {
                nombre: datosActualizados.nombre,
                apellido: datosActualizados.apellido,
                mail: mailUsuario,
                sede: datosActualizados.sede,
                genero: datosUsuario.genero,
                fotodeperfil: datosActualizados.fotodeperfil
            };
            localStorage.setItem("datosUsuario", JSON.stringify(datosActualizadosCompletos));
            
            alert("Datos guardados exitosamente");
        }
    });
}



