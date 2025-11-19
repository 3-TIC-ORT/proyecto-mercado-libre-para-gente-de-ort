import fs from "fs";
import { subscribePOSTEvent, realTimeEvent } from "soquetic";

// PEDIR LIBRO
subscribePOSTEvent("pedirLibro", (data) => {
  let tituloLibro = data.tituloLibro;

  // Leer los libros publicados
  let textoLibros = fs.readFileSync("Libros.json", "utf-8");
  let listaLibros = JSON.parse(textoLibros);

  // Buscar el libro por título
  let libroEncontrado = listaLibros.find(l => l.libro === tituloLibro);

  if (!libroEncontrado) {
    console.log("No se encontró el libro:", tituloLibro);
    return { error: "No se encontró el libro solicitado" };
  }

  // Mostrar resultado en consola
  console.log("Pedido de libro:", libroEncontrado.libro, "→ Vendedor:", libroEncontrado.nombreVendedor);

  // Enviar notificación en tiempo real al vendedor
  realTimeEvent("nuevoPedido", {
    mensaje: "¡Tienes un nuevo pedido para tu libro!",
    libro: libroEncontrado.libro,
    mailVendedor: libroEncontrado.mailVendedor
  });

  // Devolver los datos del vendedor al front
  return {
    mensaje: "Pedido encontrado",
    vendedor: {
      nombre: libroEncontrado.nombreVendedor,
      mail: libroEncontrado.mailVendedor
    }
  };
});
