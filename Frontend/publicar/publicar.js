// Conectar al servidor
connect2Server(3000);

const botonVolver = document.getElementById("botonvolver");
const botonPublicar = document.getElementById("botonpublicar");

// Botones de navegación
botonVolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

// Preview de imagen - hacer click en toda el área
const portadaContainer = document.querySelector(".portada");
const inputPortada = document.getElementById("inputPortada");
const imgPortada = document.querySelector(".img-portada");

// Hacer que todo el contenedor abra el selector de archivos
portadaContainer.addEventListener("click", function() {
    inputPortada.click();
});

inputPortada.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imgPortada.src = event.target.result;
            console.log("Imagen cargada correctamente");
        };
        reader.readAsDataURL(file);
    }
});

// Publicar libro
botonPublicar.addEventListener("click", async function(event) {
    event.preventDefault();

    // Capturar datos del formulario
    const titulo = document.getElementById("titulo").value;
    const aula = document.getElementById("aula").value;
    const año = document.getElementById("año").value;
    const materia = document.getElementById("materia").value;
    const portada = document.getElementById("inputPortada").files[0];

    // Validar campos
    if (!titulo || !aula || año === "Seleccionar año" || materia === "Seleccionar materia") {
        alert("Por favor, completa todos los campos obligatorios");
        return;
    }

    
        

        const usuario = JSON.parse(usuarioActual.value);

        // Convertir imagen a base64 si existe
        let imagenBase64 = inputPortada;
        if (portada) {
            imagenBase64 = await convertirImagenABase64(portada);
        }

        // Crear objeto del libro
        const venderLibro = {
            libro: titulo,
            aula: aula,
            año: año,
            materia: materia,
            foto: imagenBase64 || "sin-foto.jpg",
            precio: precio, // Puedes agregar un campo de precio si quieres
            descripcion: "",
            nombreVendedor: usuario.nombre,
            mailVendedor: usuario.mail,
        };

        // Obtener publicaciones existentes
        let publicaciones = [];
        try {
            const result = await window.storage.get('publicaciones', true);
            if (result) {
                publicaciones = JSON.parse(result.value);
            }
        } catch (error) {
            console.log("No hay publicaciones previas, creando lista nueva");
            publicaciones = [];
        }

        // Agregar nueva publicación
        publicaciones.push(nuevoLibro);

        // Guardar en storage compartido
        await window.storage.set('publicaciones', JSON.stringify(publicaciones), true);

        alert("¡Publicación creada exitosamente!");
        window.location.href = "../mispublicaciones/mispublicaciones.html";

    } )
// Función auxiliar para convertir imagen a base64
function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}