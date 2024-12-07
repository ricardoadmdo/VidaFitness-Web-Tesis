const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config.js');
require('dotenv').config();

//Crear el servidor de express
const app = express();

//Base de Datos
dbConnection();

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Rutas
// Usar las rutas de usuario
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/productos', require('./routes/producto'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/venta', require('./routes/venta'));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Backend corriendo en el puerto: ${process.env.PORT}`);
});
