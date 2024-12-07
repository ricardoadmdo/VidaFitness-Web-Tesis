const { Router } = require('express');
const { createVenta, getVentas, deleteVenta } = require('../controllers/venta');
const router = Router();

router.get('/', getVentas);
router.post('/', createVenta);
router.delete('/:id', deleteVenta);

module.exports = router;
