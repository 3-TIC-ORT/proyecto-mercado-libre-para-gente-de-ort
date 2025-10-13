import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";


//  REGISTRAR USUARIO

subscribePOSTEvent("registrarUsuario", (data) => {
  // Recibe los datos desde el front o desde un tester
  let nombre = data.nombre;
  let mail = data.mail;
  let sede = data.sede;
  let password = data.password;

  // 1️ Leer lo que hay en el archivo
  let texto = fs.readFileSync("Usuarios.json", "utf-8");

  // 2️ Convertir ese texto a una lista de objetos
  let lista = JSON.parse(texto);

  // 3️ Crear un nuevo objeto usuario
  let nuevoUsuario = {
    nombre: nombre,
    mail: mail,
    sede: sede,
    password: password
  };

  // 4 Agregar el nuevo usuario a la lista
  lista.push(nuevoUsuario);

  // 5️ Volver a convertir a JSON
  let jsonNuevo = JSON.stringify(lista, null, 2);

  // 6️ Guardar el archivo actualizado
  fs.writeFileSync("Usuarios.json", jsonNuevo);

  console.log("✅ Usuario registrado con éxito: " + nombre);
  return { mensaje: "✅ Usuario registrado con éxito" };
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
      console.log("✅ Bienvenido " + lista[i].nombre);
      return { mensaje: "✅ Bienvenido " + lista[i].nombre };
    }
  }

  if (encontrado == false) {
    console.log("❌ Usuario o contraseña incorrectos");
    return { error: "❌ Usuario o contraseña incorrectos" };
  }
});


//  ARRANCAR SERVIDOR SOQUETIC

startServer(3000, true);
console.log("🚀 Servidor SoqueTIC corriendo en puerto 3000");
