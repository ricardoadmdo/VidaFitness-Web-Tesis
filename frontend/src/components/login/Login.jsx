import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../auth/authContext';
import './login.css';
import background from '../../images/login.jpeg';
import { types } from '../../types/types';

const Login = () => {
	const [usuario, setUsername] = useState('');
	const [contrasena, setPassword] = useState('');
	const navigate = useNavigate();
	const { dispatch } = useContext(AuthContext);


	const handleLogin = async () => {
		try {
			const response = await Axios.post('http://localhost:3001/api/auth/login', {
				usuario,
				contrasena,
			});

			// Log para verificar la respuesta
			console.log('Respuesta de autenticación:', response.data);

			if (response.data.success) {
				const action = {
					type: types.login,
					payload: {
						nombre: response.data.nombre,
						rol: response.data.rol,
					},
				};
				dispatch(action);

				navigate('/reporte-venta');
				Swal.fire({
					title: 'Éxito',
					text: 'Inicio de sesión exitoso',
					icon: 'success',
					confirmButtonText: 'Aceptar',
				});
			} else {
				Swal.fire({
					title: 'Error',
					text: 'Usuario o contraseña incorrecto',
					icon: 'error',
					confirmButtonText: 'Aceptar',
				});
			}
		} catch (error) {
			console.error('Error durante la autenticación:', error);
			alert('Error durante la autenticación');
		}
	};

	const createAdmin = async () => {
		try {
			const response = await Axios.post('http://localhost:3001/api/auth/create-admin', {
				usuario: 'admin',
				contrasena: 'admin',
				nombre: 'Administrador',
				rol: 'Administrador',
			});

			if (response.data.success) {
				Swal.fire({
					title: 'Éxito',
					text: 'Administrador creado con éxito',
					icon: 'success',
					confirmButtonText: 'Aceptar',
				});
			}
		} catch (error) {
			console.error('Error:', error);

			Swal.fire({
				title: 'Alerta',
				text: 'El usuario administrador ya ha sido creado, por favor contactar al administrador',
				icon: 'warning',
				confirmButtonText: 'Aceptar',
			});
		}
	};

	return (
		<div
			className='container-fluid d-flex justify-content-center align-items-center vh-100 animate__animated animate__fadeIn'
			style={{
				backgroundImage: `url(${background})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
			}}
		>
			<div
				className='card p-4 shadow text-center animate__animated animate__fadeIn'
				style={{ borderRadius: '24px', backgroundColor: 'rgba(250, 250, 250, 0.9)' }}
			>
				<h3 className='mb-3'>Iniciar Sesión</h3>
				<form className='d-grid gap-3' onSubmit={(e) => e.preventDefault()}>
					<div className='form-group'>
						<label htmlFor='username'>Nombre de Usuario:</label>
						<input
							type='text'
							className='form-control'
							id='username'
							placeholder='Ingrese su nombre de usuario'
							value={usuario}
							onChange={(e) => setUsername(e.target.value)}
							style={{ padding: '7px', fontSize: '1rem' }}
							required
						/>
					</div>
					<div className='form-group position-relative'>
						<label htmlFor='password'>Contraseña:</label>
						<input
							type='password'
							className='form-control'
							id='password'
							placeholder='Ingrese su contraseña'
							value={contrasena}
							onChange={(e) => setPassword(e.target.value)}
							style={{ padding: '10px', fontSize: '1rem' }}
							required
						/>
					</div>
					<button type='button' className='btn btn-success w-100' onClick={handleLogin}>
						Iniciar Sesión
					</button>
				</form>
				<div className='mt-3'>
					<button type='button' className='btn btn-outline-primary w-100' onClick={createAdmin}>
						Crear Usuario Administrador
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
