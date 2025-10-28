import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";


//  REGISTRAR USUARIO

subscribePOSTEvent("registrarUsuario", (data) => {
  // Recibe los datos desde el front
  let nombre = data.nombre;
  let mail = data.mail;
  let sede = data.sede;
  let password = data.password;
  let genero = data.genero;
  // 1️ Leer lo que hay en el archivo
  let texto = fs.readFileSync("Usuarios.json", "utf-8");

  // 2️ Convertir ese texto a una lista de objetos
  let lista = JSON.parse(texto);

  // 3️ Crear un nuevo objeto usuario
  let nuevoUsuario = {
    nombre: nombre,
    mail: mail,
    sede: sede,
    password: password,
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
      return { mensaje: "Bienvenido " + lista[i].nombre };
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

  // 3️ Crear un nuevo libro
  let nuevoLibro = {
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

  console.log("Se ha publicado el libro" + libro);
  return { mensaje: "Libro publicado con exito" };
});

//  ARRANCAR SERVIDOR SOQUETIC

startServer(3000, true);
console.log("🚀 Servidor SoqueTIC corriendo en puerto 3000");
