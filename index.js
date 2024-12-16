const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors());


app.use(express.json());

// Leer productos
app.get('/productos', (req, res) => {
  fs.readFile('productos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo.');
    res.send(JSON.parse(data));
  });
});

// Crear un nuevo producto
app.post('/productos', (req, res) => {
  const nuevoProducto = req.body;
  fs.readFile('productos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo.');
    const productos = JSON.parse(data);
    productos.push(nuevoProducto);
    fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el archivo.');
      res.send('Producto agregado con éxito.');
    });
  });
});

// Eliminar un producto por ID
app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile('productos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo.');
    let productos = JSON.parse(data);
    productos = productos.filter(p => p.id !== id);
    fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el archivo.');
      res.send('Producto eliminado con éxito.');
    });
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

// Filtrar productos
app.get('/productos/filtrar', (req, res) => {
  const { categoria, color, talla, precioMin, precioMax } = req.query;

  fs.readFile('productos.json', 'utf-8', (err, data) => {
      if (err) return res.status(500).send('Error al leer el archivo.');
      
      let productos = JSON.parse(data);

      // Filtros dinámicos
      if (categoria) productos = productos.filter(p => p.categoria === categoria);
      if (color) productos = productos.filter(p => p.color === color);
      if (talla) productos = productos.filter(p => p.talla === talla);
      if (precioMin) productos = productos.filter(p => p.precio >= parseFloat(precioMin));
      if (precioMax) productos = productos.filter(p => p.precio <= parseFloat(precioMax));

      res.send(productos);
  });
});

  
