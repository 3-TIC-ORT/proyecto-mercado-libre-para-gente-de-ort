const botonVolver = document.getElementById("botonvolver");
const botonPublicar = document.getElementById("botonpublicar");




botonVolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});





botonPublicar.addEventListener("click", function() {
    window.location.href = "../mispublicaciones/mispublicaciones.html";
});


document.getElementById("botonpublicar").addEventListener("click", async () => {
    // Capturar datos del formulario
    const titulo = document.getElementById("titulo").value;
    const aula = document.getElementById("aula").value;
    const año = document.getElementById("año").value;
    const materia = document.querySelector("select:nth-of-type(2)").value;
    const portada = document.getElementById("inputPortada").files[0];
  
    // Validar que los campos estén completos
    if (!titulo || !aula || año === "Seleccionar año" || materia === "Seleccionar materia" || !portada) {
      alert("Por favor, completa todos los campos");
      return;
    }
  
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("aula", aula);
    formData.append("año", año);
    formData.append("materia", materia);
    formData.append("portada", portada);
  
    try {
      // Enviar datos al backend
      const response = await fetch("/api/publicaciones", {
        method: "POST",
        body: formData
      });
  
      if (response.ok) {
        alert("Publicación subida exitosamente");
        // Limpiar formulario
        document.getElementById("titulo").value = "";
        document.getElementById("aula").value = "";
        document.getElementById("año").value = "Seleccionar año";
        document.querySelector("select:nth-of-type(2)").value = "Seleccionar materia";
        
        // Redirigir a mispublicaciones
        window.location.href = "../mispublicaciones/mispublicaciones.html";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al publicar");
    }
  });