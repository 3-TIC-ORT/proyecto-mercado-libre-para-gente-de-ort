const Botonvolver = document.getElementById("botonvolver");
const Botonagregar = document.getElementById("botonagregar");

Botonvolver.addEventListener("click", function() {
    window.location.href = "../compraoventa/compraoventa.html";
});

Botonagregar.addEventListener("click", function() {
    window.location.href = "../publicar/publicar.html";;
});

// En mispublicaciones.js
async function cargarPublicaciones() {
    try {
      const response = await fetch("/api/publicaciones");
      const publicaciones = await response.json();
      
      const contenedor = document.getElementById("contenedor-publicaciones");
      publicaciones.forEach(pub => {
        const div = document.createElement("div");
        div.innerHTML = `
          <img src="${pub.portada}" alt="${pub.titulo}">
          <h3>${pub.titulo}</h3>
          <p>Aula: ${pub.aula}</p>
          <p>Año: ${pub.año}</p>
          <p>Materia: ${pub.materia}</p>
        `;
        contenedor.appendChild(div);
      });
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  }
  
  cargarPublicaciones();