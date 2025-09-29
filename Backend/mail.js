import express from "express";
import bcrypt from "bcrypt";
import fs from "fs";

const router = express.Router();

router.post("/register", async (req, res) => {
  let { nombre, mail, sede, password, foto } = req.body;

  if (!mail.endsWith("@ort.edu.ar")) {
    return res.status(400).json({ error: "El mail debe ser de ORT" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let usuarios = JSON.parse(fs.readFileSync("Usuarios.json", "utf8"));
  usuarios.push({ nombre, mail, sede, foto: foto || null, password: hashedPassword });
  fs.writeFileSync("Usuarios.json", JSON.stringify(usuarios, null, 2));

  res.json({ mensaje: "Usuario registrado con éxito" });
});

export default router;
