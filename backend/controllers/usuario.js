const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const createUsuario = async (req, res) => {
	const { nombre, contrasena, usuario, rol } = req.body;

	try {
		// Encriptar la contraseña
		const salt = bcryptjs.genSaltSync();
		const hashedPassword = bcryptjs.hashSync(contrasena, salt);

		const newUsuario = new Usuario({
			nombre,
			contrasena: hashedPassword,
			usuario,
			rol,
		});

		await newUsuario.save();
		res.status(201).json(newUsuario);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUsuarios = async (req, res) => {
	try {
		const usuarios = await Usuario.find();
		res.status(200).json({ usuarios });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUsuarioPorId = async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.params.id);
		if (!usuario) {
			return res.status(404).json({ msg: 'Usuario no encontrado' });
		}
		res.json(usuario);
	} catch (error) {
		console.error('Error al obtener el usuario:', error);
		res.status(500).json({ msg: 'Error del servidor', error: error.message });
	}
};

const updateUsuario = async (req, res) => {
	const { id } = req.params;
	const { nombre, contrasena, usuario, rol } = req.body;

	try {
		const usuarioExistente = await Usuario.findById(id);
		if (usuarioExistente) {
			// Actualizamos los campos solo si están presentes en el cuerpo de la solicitud
			usuarioExistente.nombre = nombre !== undefined ? nombre : usuarioExistente.nombre;
			if (contrasena !== undefined) {
				// Encriptar la nueva contraseña
				const salt = bcryptjs.genSaltSync();
				usuarioExistente.contrasena = bcryptjs.hashSync(contrasena, salt);
			}
			usuarioExistente.usuario = usuario !== undefined ? usuario : usuarioExistente.usuario;
			usuarioExistente.rol = rol !== undefined ? rol : usuarioExistente.rol;

			await usuarioExistente.save();
			res.status(200).json(usuarioExistente);
		} else {
			res.status(404).json({ message: 'Usuario no encontrado' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteUsuario = async (req, res) => {
	const { id } = req.params;

	try {
		const usuario = await Usuario.findById(id);
		if (usuario) {
			await usuario.deleteOne();
			res.status(200).json({ message: 'Usuario eliminado' });
		} else {
			res.status(404).json({ message: 'Usuario no encontrado' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createUsuario,
	getUsuarios,
	updateUsuario,
	deleteUsuario,
	getUsuarioPorId,
};
