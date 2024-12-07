const { Router } = require('express');
const { productosPost, productosGet, productosPut, productoDelete, getProductoPorId, productosBuscar } = require('../controllers/producto');

const router = Router();

// Crear un nuevo Producto
router.post('/', productosPost);

// Obtener todos los Producto
router.get('/', productosGet);

// Obtener 1 producto por su id
router.get('/:id', getProductoPorId);

// Buscar producto por su Nombre
router.get('/', productosBuscar);

// Actualizar un Producto
router.put('/:id', productosPut);

// Eliminar un Producto
router.delete('/:id', productoDelete);

module.exports = router;
