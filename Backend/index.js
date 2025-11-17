import fs from "fs";
import "./pedidoLibro.js";
import { subscribePOSTEvent, startServer, realTimeEvent } from "soquetic";

//  REGISTRAR USUARIO

subscribePOSTEvent("registrarUsuario", (data) => {
  // Recibe los datos desde el front
  let nombre = data.nombre;
  let apellido = data.apellido;
  let mail = data.mail;
  let sede = data.sede;
  let password = data.contraseña;
  let fotodeperfil = data.fotodeperfil
  let genero = data.genero;
  // 1️ Leer lo que hay en el archivo
  let texto = fs.readFileSync("Usuarios.json", "utf-8");

  // 2️ Convertir ese texto a una lista de objetos
  let lista = JSON.parse(texto);

  // 3️ Crear un nuevo objeto usuario
  let nuevoUsuario = {
    nombre: nombre,
    apellido: apellido,
    mail: mail,
    sede: sede,
    password: password,
    fotodeperfil: fotodeperfil,
    genero: genero
  };

  // 4 Agregar el nuevo usuario a la lista
  lista.push(nuevoUsuario);

  // 5️ Volver a convertir a JSON
  let jsonNuevo = JSON.stringify(lista, null, 2);

  // 6️ Guardar el archivo actualizado
  fs.writeFileSync("Usuarios.json", jsonNuevo);

  console.log("Usuario registrado con éxito: " + nombre);
  return { mensaje: "Usuario registrado con éxito" };
});

//  LOGIN DE USUARIO

subscribePOSTEvent("loginUsuario", (data) => {
  let mail = data.mail;
  let password = data.password;

  let texto = fs.readFileSync("Usuarios.json", "utf-8");
  let lista = JSON.parse(texto);

  let encontrado = false;

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].mail == mail && lista[i].password == password) {
      encontrado = true;
      console.log("Bienvenido " + lista[i].nombre);
      // Devolver los datos del usuario (sin la contraseña por seguridad)
      return { 
        mensaje: "Bienvenido " + lista[i].nombre,
        usuario: {
          nombre: lista[i].nombre,
          apellido: lista[i].apellido,
          mail: lista[i].mail,
          sede: lista[i].sede,
          genero: lista[i].genero
        }
      };
    }
  }

  if (encontrado == false) {
    console.log("Usuario o contraseña incorrectos");
    return { error: "Usuario o contraseña incorrectos" };
  }
});

subscribePOSTEvent("venderLibro", (data) => {
  // Recibe los datos desde el front
  let libro = data.libro;
  let materia = data.materia;
  let año = data.año;
  let aula = data.aula;
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
  aula: aula,
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

// 📚 OBTENER PUBLICACIONES DE UN USUARIO
subscribePOSTEvent("obtenerMisPublicaciones", (data) => {
  let mailUsuario = data.mailUsuario;

  // 1️ Leer los libros actuales
  let textoLibros = fs.readFileSync("Libros.json", "utf-8");
  let listaLibros = JSON.parse(textoLibros);

  // 2️ Filtrar solo los libros del usuario
  let misLibros = listaLibros.filter(libro => libro.mailVendedor === mailUsuario);

  console.log(`📚 Usuario ${mailUsuario} tiene ${misLibros.length} publicaciones`);
  return { libros: misLibros };
});

// 📚 OBTENER TODOS LOS LIBROS
subscribePOSTEvent("obtenerTodosLosLibros", (data) => {
  // 1️ Leer los libros actuales
  let textoLibros = fs.readFileSync("Libros.json", "utf-8");
  let listaLibros = JSON.parse(textoLibros);

  console.log(`📚 Enviando ${listaLibros.length} libros`);
  return { libros: listaLibros };
});

// 📬 CREAR PEDIDO DE LIBRO (Notificación al vendedor)
subscribePOSTEvent("pedirLibro", (data) => {
  let idLibro = data.idLibro;
  let mailComprador = data.mailComprador;
  let nombreComprador = data.nombreComprador;

  // 1️ Leer el libro para obtener info del vendedor
  let textoLibros = fs.readFileSync("Libros.json", "utf-8");
  let listaLibros = JSON.parse(textoLibros);
  
  let libro = listaLibros.find(l => l.id === idLibro);
  
  if (!libro) {
    return { error: "Libro no encontrado" };
  }

  // 2️ Leer notificaciones actuales
  let textoNotificaciones = fs.readFileSync("Notificaciones.json", "utf-8");
  let listaNotificaciones = JSON.parse(textoNotificaciones);

  // 3️ Crear notificación para el vendedor
  let nuevaNotificacion = {
    id: Date.now(),
    tipo: "pedido",
    idLibro: idLibro,
    libroNombre: libro.libro,
    mailVendedor: libro.mailVendedor,
    nombreVendedor: libro.nombreVendedor,
    mailComprador: mailComprador,
    nombreComprador: nombreComprador,
    estado: "pendiente", // pendiente, aceptado, rechazado
    fecha: new Date().toISOString()
  };

  // 4️ Agregar notificación
  listaNotificaciones.push(nuevaNotificacion);

  // 5️ Guardar
  let jsonNotificaciones = JSON.stringify(listaNotificaciones, null, 2);
  fs.writeFileSync("Notificaciones.json", jsonNotificaciones);

  console.log(`📬 ${nombreComprador} pidió el libro "${libro.libro}" a ${libro.nombreVendedor}`);
  return { mensaje: "Pedido enviado exitosamente" };
});

// ✅ ACEPTAR PEDIDO
subscribePOSTEvent("aceptarPedido", (data) => {
  let idNotificacion = data.idNotificacion;

  // 1️ Leer notificaciones
  let textoNotificaciones = fs.readFileSync("Notificaciones.json", "utf-8");
  let listaNotificaciones = JSON.parse(textoNotificaciones);

  // 2️ Buscar la notificación
  let notificacion = listaNotificaciones.find(n => n.id === idNotificacion);
  
  if (!notificacion) {
    return { error: "Notificación no encontrada" };
  }

  // 3️ Marcar como aceptado
  notificacion.estado = "aceptado";

  // 4️ Crear notificación para el comprador
  let notificacionComprador = {
    id: Date.now(),
    tipo: "respuesta",
    idLibro: notificacion.idLibro,
    libroNombre: notificacion.libroNombre,
    mailVendedor: notificacion.mailVendedor,
    nombreVendedor: notificacion.nombreVendedor,
    mailComprador: notificacion.mailComprador,
    nombreComprador: notificacion.nombreComprador,
    estado: "aceptado",
    mensaje: `Tu pedido del libro "${notificacion.libroNombre}" fue aceptado por ${notificacion.nombreVendedor}`,
    fecha: new Date().toISOString()
  };

  listaNotificaciones.push(notificacionComprador);

  // 5️ Guardar notificaciones
  let jsonNotificaciones = JSON.stringify(listaNotificaciones, null, 2);
  fs.writeFileSync("Notificaciones.json", jsonNotificaciones);

  // 6️ Eliminar el libro del catálogo
  let textoLibros = fs.readFileSync("Libros.json", "utf-8");
  let listaLibros = JSON.parse(textoLibros);
  
  let libroIndex = listaLibros.findIndex(l => l.id === notificacion.idLibro);
  
  if (libroIndex !== -1) {
    listaLibros.splice(libroIndex, 1);
    let jsonLibros = JSON.stringify(listaLibros, null, 2);
    fs.writeFileSync("Libros.json", jsonLibros);
  }

  console.log(`✅ Pedido aceptado: ${notificacion.libroNombre}`);
  return { mensaje: "Pedido aceptado exitosamente", notificacion: notificacion };
});

// ❌ RECHAZAR PEDIDO
subscribePOSTEvent("rechazarPedido", (data) => {
  let idNotificacion = data.idNotificacion;

  // 1️ Leer notificaciones
  let textoNotificaciones = fs.readFileSync("Notificaciones.json", "utf-8");
  let listaNotificaciones = JSON.parse(textoNotificaciones);

  // 2️ Buscar la notificación
  let notificacion = listaNotificaciones.find(n => n.id === idNotificacion);
  
  if (!notificacion) {
    return { error: "Notificación no encontrada" };
  }

  // 3️ Marcar como rechazado
  notificacion.estado = "rechazado";

  // 4️ Crear notificación para el comprador
  let notificacionComprador = {
    id: Date.now() + 1, // Evitar duplicados si se crean simultáneamente
    tipo: "respuesta",
    idLibro: notificacion.idLibro,
    libroNombre: notificacion.libroNombre,
    mailVendedor: notificacion.mailVendedor,
    nombreVendedor: notificacion.nombreVendedor,
    mailComprador: notificacion.mailComprador,
    nombreComprador: notificacion.nombreComprador,
    estado: "rechazado",
    mensaje: `Tu pedido del libro "${notificacion.libroNombre}" fue rechazado por ${notificacion.nombreVendedor}`,
    fecha: new Date().toISOString()
  };

  listaNotificaciones.push(notificacionComprador);

  // 5️ Guardar notificaciones
  let jsonNotificaciones = JSON.stringify(listaNotificaciones, null, 2);
  fs.writeFileSync("Notificaciones.json", jsonNotificaciones);

  console.log(`❌ Pedido rechazado: ${notificacion.libroNombre}`);
  return { mensaje: "Pedido rechazado", notificacion: notificacion };
});

// 📋 OBTENER NOTIFICACIONES DE UN USUARIO
subscribePOSTEvent("obtenerNotificaciones", (data) => {
  let mailUsuario = data.mailUsuario;

  // 1️ Leer notificaciones
  let textoNotificaciones = fs.readFileSync("Notificaciones.json", "utf-8");
  let listaNotificaciones = JSON.parse(textoNotificaciones);

  // 2️ Filtrar notificaciones del usuario (como vendedor o comprador)
  let misNotificaciones = listaNotificaciones.filter(n => 
    n.mailVendedor === mailUsuario || n.mailComprador === mailUsuario
  );

  // 3️ Ordenar por fecha (más recientes primero)
  misNotificaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  console.log(`📋 Usuario ${mailUsuario} tiene ${misNotificaciones.length} notificaciones`);
  return { notificaciones: misNotificaciones };
});

//  ARRANCAR SERVIDOR SOQUETIC

startServer(3000, true);
console.log("🚀 Servidor SoqueTIC corriendo en puerto 3000");