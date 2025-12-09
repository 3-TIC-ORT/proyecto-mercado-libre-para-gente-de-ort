connect2Server(3000);

const buscador = document.getElementById("buscador");
const botonVolver = document.getElementById("botonvolver");
const botonPublicar = document.getElementById("botonpublicar");

buscador.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const terminoBusqueda = buscador.value.trim();
        if (terminoBusqueda !== "") {
            localStorage.setItem("terminoBusqueda", terminoBusqueda);
            window.location.href = "../catalogo/catalogo.html";
        }
    }
});

botonVolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

const portadaContainer = document.querySelector(".portada");
const inputPortada = document.getElementById("inputPortada");
const imgPortada = document.querySelector(".img-portada");

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

botonPublicar.addEventListener("click", async function(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const aula = document.getElementById("aula").value;
    const año = document.getElementById("año").value;
    const materia = document.getElementById("materia").value;
    const precio = document.getElementById("precio").value;
    const portada = document.getElementById("inputPortada").files[0];

    if (!titulo || !aula || año === "Seleccionar año" || materia === "Seleccionar materia" || !precio) {
        alert("Por favor, completa todos los campos obligatorios");
        return;
    }

    try {

        const datosUsuarioStr = localStorage.getItem("datosUsuario");
        if (!datosUsuarioStr) {
            alert("Debes iniciar sesión para publicar un libro");
            window.location.href = "../login/login.html";
            return;
        }

        const usuario = JSON.parse(datosUsuarioStr);

        let imagenBase64 = "sin-foto.jpg";
        if (portada) {
            imagenBase64 = await convertirImagenABase64(portada);
        }

        const datosLibro = {
            libro: titulo,
            materia: materia,
            año: año,
            aula: aula,
            sede: usuario.sede || "Montañeses",
            precio: precio,
            foto: imagenBase64,
            descripcion: "",
            nombreVendedor: usuario.nombre || "Usuario",
            mailVendedor: usuario.mail
        };

        console.log("Datos del libro a publicar:", datosLibro);

        postEvent("venderLibro", datosLibro, function(respuesta) {
            if (respuesta.error) {
                alert("Error al publicar: " + respuesta.error);
            } else {
                alert("¡Publicación creada exitosamente!");
                window.location.href = "../mispublicaciones/mispublicaciones.html";
            }
        });
    } catch (error) {
        console.error("Error al publicar:", error);
        alert("Hubo un error al publicar el libro. Por favor, intenta de nuevo.");
    }
});
function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}