const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	precio: {
		type: Number,
		required: true,
	},
	precioCosto: {
		type: Number,
		required: true,
	},
	cantidad: {
		type: Number,
		required: true,
	},
});

const VentaSchema = new Schema({
	productos: {
		type: [ProductoSchema],
		required: true,
	},
	totalProductos: {
		type: Number,
		required: true,
	},
	precioTotal: {
		type: Number,
		required: true,
	},
	fecha: {
		type: Date,
		required: true,
		default: Date.now,
	},
	tipoPago: {
		type: String,
		enum: ['Efectivo', 'Transferencia'],
		required: true,
	},
});

VentaSchema.methods.toJSON = function () {
	const { __v, _id, ...venta } = this.toObject();
	venta.uid = _id;
	return venta;
};

module.exports = model('Venta', VentaSchema);
