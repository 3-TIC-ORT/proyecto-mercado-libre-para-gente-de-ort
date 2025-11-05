import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";

// === REGISTRO DE USUARIO ===
subscribePOSTEvent("registrarUsuario", (data) => {
  try {
    const { nombre, apellido, usuario, contraseña, genero, sede } = data;

    // Leer archivo existente o crear uno vacío si no existe
    let lista = [];
    if (fs.existsSync("Usuarios.json")) {
      const texto = fs.readFileSync("Usuarios.json", "utf-8");
      lista = JSON.parse(texto);
    }

    // Crear nuevo usuario
    const nuevoUsuario = { nombre, apellido, usuario, contraseña, genero, sede };
    lista.push(nuevoUsuario);

    // Guardar archivo actualizado
    fs.writeFileSync("Usuarios.json", JSON.stringify(lista, null, 2));

    console.log("✅ Usuario registrado con éxito:", nombre);
    return { success: true, message: "Usuario registrado con éxito" };

  } catch (error) {
    console.error("❌ Error en registro:", error);
    return { success: false, message: "Error en el servidor" };
  }
});

// === LOGIN DE USUARIO (opcional para más adelante) ===
// subscribePOSTEvent("loginUsuario", ...)

startServer(3000, true);
console.log("🚀 Servidor Soquetic corriendo en puerto 3000");
