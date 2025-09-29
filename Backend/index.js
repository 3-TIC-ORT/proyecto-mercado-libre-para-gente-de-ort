import fs from "fs";

// Leer archivo
let personas = fs.readFileSync("Usuarios.json", "utf-8");
let datos = JSON.parse(personas);

// Nuevo usuario
let nuevousuario = {
  nombre: "Juan",
  mail: "bg1373@est.ort.edu.ar",
  sede: "Montañeses",
  password: "91218"
};

// Agregar al array
datos.push(nuevousuario);

// Convertir a JSON
let Jsonnuevo = JSON.stringify(datos, null, 2);

// Guardar en archivo
fs.writeFileSync("Usuarios.json", Jsonnuevo);
console.log("✅ Usuario agregado con éxito");
