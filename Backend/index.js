import fs from "fs";
import "./pedidoLibro.js";
import { subscribePOSTEvent, startServer, realTimeEvent } from "soquetic";

const fs = require('fs');

// LOGIN DE USUARIO
subscribePOSTEvent("loginUsuario", (data) => {
  let mail = data.mail;
  let password = data.password;

  // Leer el archivo de usuarios
  let texto = fs.readFileSync("Usuarios.json", "utf-8");
  let lista = JSON.parse(texto);

  // Buscar usuario en la lista
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].mail === mail && lista[i].password === password) {
      console.log("Login exitoso: " + lista[i].nombre);
      return { 
        mensaje: "Bienvenido " + lista[i].nombre,
        nombre: lista[i].nombre,
        mail: lista[i].mail
      };
    }
  }

  // Si no se encontró
  console.log("Usuario o contraseña incorrectos");
  return { error: "Usuario o contraseña incorrectos" };
});

// REGISTRO DE USUARIO
subscribePOSTEvent("registrarUsuario", (data) => {
  let { nombre, apellido, usuario, contraseña, genero, sede } = data;

  // Leer usuarios existentes
  let texto = fs.readFileSync("Usuarios.json", "utf-8");
  let lista = JSON.parse(texto);

  // Verificar si el usuario ya existe
  let usuarioExistente = lista.find(u => u.mail === usuario);
  if (usuarioExistente) {
    return { error: "El usuario ya existe" };
  }

  // Crear nuevo usuario
  let nuevoUsuario = {
    nombre: nombre,
    apellido: apellido,
    mail: usuario,
    password: contraseña,
    genero: genero,
    sede: sede
  };

  // Agregar a la lista y guardar
  lista.push(nuevoUsuario);
  fs.writeFileSync("Usuarios.json", JSON.stringify(lista, null, 2));

  console.log("Usuario registrado: " + nombre);
  return { mensaje: "Usuario registrado exitosamente" };
});

subscribePOSTEvent("venderLibro", (data) => {
  // Recibe los datos desde el front
  let portada = data.inputPortada
  let libro = data.libro;
  let materia = data.materia;
  let año = data.año;
  let sede = data.sede;
  let precio = data.precio;
  let foto = data.foto;
  let descripcion = data.descripcion;
  let nombreVendedor = data.nombreVendedor;
  let mailVendedor = data.mailVendedor;

  // 1️ Leer lo que hay en el archivo
  let textoLibros = fs.readFileSync("Libros.json", "utf-8");

  // 2️ Convertir ese texto a una lista de objetos
  let listaLibros = JSON.parse(textoLibros);

  // 3️ Crear un nuevo libro con ID único
  let nuevoLibro = {
  id: Date.now(), // ID único basado en timestamp
  libro: libro,
  materia: materia,
  año: año,
  sede: sede,
  precio: precio,
  foto: foto,
  descripcion: descripcion,
  nombreVendedor: nombreVendedor,
  mailVendedor: mailVendedor
  };

  // 4 Agregar el nuevo libro a la lista
  listaLibros.push(nuevoLibro);

  // 5️ Volver a convertir a JSON
  let jsonLibro = JSON.stringify(listaLibros, null, 2);

  // 6️ Guardar el archivo actualizado
  fs.writeFileSync("Libros.json", jsonLibro);

  console.log("Se ha publicado el libro: " + libro);
  
  // 7️ Enviar notificación en tiempo real al vendedor
  realTimeEvent("libroPublicado", {
    mensaje: "¡Tu libro ha sido publicado exitosamente!",
    libro: libro,
    mailVendedor: mailVendedor
  });

  return { mensaje: "Libro publicado con éxito" };
});


// 🗑️ BORRAR LIBRO
subscribePOSTEvent("borrarLibro", (data) => {
  let idLibro = data.id;
  let mailUsuario = data.mailUsuario; // Para verificar que solo el dueño pueda borrar

  // 1️ Leer los libros actuales
  let textoLibros = fs.readFileSync("Libros.json", "utf-8");
  let listaLibros = JSON.parse(textoLibros);

  // 2️ Buscar el libro
  let libroIndex = listaLibros.findIndex(l => l.id === idLibro);

  if (libroIndex === -1) {
    console.log("❌ No se encontró el libro con ID:", idLibro);
    return { error: "Libro no encontrado" };
  }

  // 3️ Verificar que el usuario sea el dueño
  if (listaLibros[libroIndex].mailVendedor !== mailUsuario) {
    console.log("❌ Usuario no autorizado para borrar este libro");
    return { error: "No tienes permiso para borrar este libro" };
  }

  // 4️ Eliminar el libro
  let libroEliminado = listaLibros.splice(libroIndex, 1)[0];

  // 5️ Guardar el archivo actualizado
  let jsonLibro = JSON.stringify(listaLibros, null, 2);
  fs.writeFileSync("Libros.json", jsonLibro);

  console.log("🗑️ Libro eliminado:", libroEliminado.libro);
  return { mensaje: "Libro eliminado con éxito", libroEliminado: libroEliminado };
});


//  ARRANCAR SERVIDOR SOQUETIC

startServer(3000, true);
console.log("🚀 Servidor SoqueTIC corriendo en puerto 3000");