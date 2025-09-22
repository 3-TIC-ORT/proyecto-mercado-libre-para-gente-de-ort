import { isUtf8 } from "buffer";
import fs from "fs";

//registrase
//lee que tengo en json
let personas = fs.readFileSync("Usuarios.json", "utf-8");
//convierte datos de json en java
let datos = JSON.parse(personas);

//datos que me pase el front
let nuevousuario={}
//agrega a la lista
datos.push(nuevousario);
let Jsonnuevo = JSON.stringify(personas, null, 2);

fs.writeFileSync ("Usuarios.json , Jsonnuevo");
console.log ("Se agrego el nombre con exito!!!");




//LOGIN
// Lee cosas del JSON y lo convierte en java
let usuarioLOGIN= fs.readFileSync ("Usuarios.json" , "utf-8");
let JSONLOGIN = JSON.parse(usarioLOGIN);

for (let i = 0; i < JSONLOGIN.length; i++){
    if (JSONLOGIN[i].nombre == "Juan" && JSONLOGIN[i].password == "91218") {
        console.log ("Bienvenido")
    }
    else {
console.log ("Usuario o contraseña incorrecta")
    }
}