import nodemailer from "nodemailer";

// Configuración con Gmail (puede ser otro servicio)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tucuenta@gmail.com", // ⚠️ Después usás variables de entorno .env
    pass: "tucontraseña"       // ⚠️ Nunca hardcodear en el repo
  }
});

function enviarMailAlVendedor(idLibro) {
  let libros = JSON.parse(fs.readFileSync("Libros.json", "utf8"));
  let libro = libros.find(l => l.id === idLibro);

  let mailOptions = {
    from: "tucuenta@gmail.com",
    to: libro.vendedorMail, // lo guardás cuando se publica el libro
    subject: "¡Tu libro tiene un pedido! 📚",
    text: `Hola! El libro "${libro.nombre}" recibió un pedido. Revisá la plataforma para más info.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("📩 Email enviado: " + info.response);
    }
  });
}
