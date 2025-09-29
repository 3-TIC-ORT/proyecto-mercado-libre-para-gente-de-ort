router.post("/books", (req, res) => {
    let { nombre, materia, año, sede, descripcion, foto, precio } = req.body;
  
    let libros = JSON.parse(fs.readFileSync("Libros.json", "utf8"));
    libros.push({ nombre, materia, año, sede, descripcion, foto, precio });
    fs.writeFileSync("Libros.json", JSON.stringify(libros, null, 2));
  
    res.json({ mensaje: "📚 Libro publicado con éxito!" });
  });

  
  router.post("/orders", (req, res) => {
    let { idLibro, comprador } = req.body;
  
    let pedidos = JSON.parse(fs.readFileSync("Pedidos.json", "utf8"));
    pedidos.push({ idLibro, comprador, fecha: new Date() });
    fs.writeFileSync("Pedidos.json", JSON.stringify(pedidos, null, 2));
  
    // Acá mandamos el mail al vendedor
    enviarMailAlVendedor(idLibro);
  
    res.json({ mensaje: "✅ Pedido realizado con éxito" });
  });
  