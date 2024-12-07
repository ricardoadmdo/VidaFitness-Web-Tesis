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
	cantidadTienda: {
		type: Number,
		required: true,
	},
	cantidadAlmacen: {
		type: Number,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
});

ProductoSchema.methods.toJSON = function () {
	const { __v, _id, ...producto } = this.toObject();
	producto.uid = _id;
	return producto;
};

module.exports = model('Producto', ProductoSchema);
