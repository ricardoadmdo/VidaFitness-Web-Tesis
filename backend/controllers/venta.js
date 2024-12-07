const { response, request } = require('express');
const Venta = require('../models/venta');
const Producto = require('../models/producto');

// Crear una nueva venta
const createVenta = async (req, res) => {
	const { productos, ...datos } = req.body;

	try {
		// Verifica que los campos requeridos estén presentes
		if (!datos || !productos || productos.length === 0) {
			return res.status(400).json({ message: 'Campos requeridos faltantes' });
		}

		// Crear un nuevo objeto Venta con los datos recibidos
		const nuevaVenta = new Venta({ ...datos, productos });

		// Guardar la nueva venta en la base de datos
		await nuevaVenta.save();

		// Actualizar cantidades de productos
		for (let producto of productos) {
			await Producto.findByIdAndUpdate(producto.uid, { $inc: { cantidadTienda: -producto.cantidad } });
		}

		// Devolver la nueva venta
		res.status(201).json(nuevaVenta);
	} catch (error) {
		console.error('Error al crear venta:', error.message);
		res.status(500).json({ message: 'Error al crear venta' });
	}
};

const getVentas = async (req = request, res = response) => {
	try {
		const { day, month, year, limit = 8, page = 1 } = req.query;
		const skip = (page - 1) * limit;
		let query = {};

		// Verificar si se ha proporcionado una fecha
		if (day && month && year) {
			const startDate = new Date(year, month - 1, day);
			const endDate = new Date(year, month - 1, day);
			endDate.setHours(23, 59, 59, 999);

			query.fecha = {
				$gte: startDate,
				$lt: endDate,
			};
		}

		const [ventas, total] = await Promise.all([Venta.find(query).skip(Number(skip)).limit(Number(limit)), Venta.countDocuments(query)]);

		res.status(200).json({
			total,
			ventas,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error('Error al obtener las ventas:', error);
		res.status(500).json({
			msg: 'Error al obtener las ventas',
			error: error.message,
		});
	}
};

const deleteVenta = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const ventaEliminada = await Venta.findByIdAndDelete(id);

		if (!ventaEliminada) {
			return res.status(404).json({ message: 'Venta no encontrada' });
		}

		res.status(200).json({ message: 'Venta eliminada con éxito' });
	} catch (error) {
		console.error('Error al eliminar venta:', error);
		res.status(500).json({ message: 'Error al eliminar venta' });
	}
};

module.exports = {
	createVenta,
	getVentas,
	deleteVenta,
};
