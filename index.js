const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de carpeta para almacenar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Renombrar archivo para evitar conflictos
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Ruta para servir imágenes de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Leer productos
app.get('/productos', (req, res) => {
  fs.readFile('productos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo.');
    res.send(JSON.parse(data));
  });
});

// Crear un nuevo producto con imagen
app.post('/productos', upload.array('imagenes', 5), (req, res) => {
  const nuevoProducto = req.body;

  // Procesar imágenes subidas y añadir rutas al producto
  if (req.files) {
    nuevoProducto.imagenes = req.files.map(file => `/uploads/${file.filename}`);
  } else {
    nuevoProducto.imagenes = [];
  }

  fs.readFile('productos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo.');
    const productos = JSON.parse(data);

    // Asignar ID automático
    nuevoProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
    productos.push(nuevoProducto);

    fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el archivo.');
      res.send('Producto agregado con éxito.');
    });
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
