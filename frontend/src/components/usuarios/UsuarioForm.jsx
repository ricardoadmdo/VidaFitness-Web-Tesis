import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const UsuarioForm = () => {
	const [nombre, setNombre] = useState('');
	const [contrasena, setContrasena] = useState('');
	const [usuario, setUsuario] = useState('');
	const [rol, setRol] = useState('');

	const [editar, setEditar] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			setEditar(true);
			getUsuario(id);
		}
	}, [id]);

	const getUsuario = (id) => {
		Axios.get(`http://localhost:3001/api/usuarios/${id}`)
			.then((response) => {
				const usuario = response.data;
				setNombre(usuario.nombre);
				setUsuario(usuario.usuario);
				setRol(usuario.rol);
			})
			.catch((error) => {
				console.error('Hubo un error al obtener el producto:', error);
				Swal.fire({
					title: 'Error',
					text: 'Hubo un error al obtener el producto. Por favor, intente de nuevo.',
					icon: 'error',
					confirmButtonText: 'Aceptar',
				});
			});
	};

	const add = () => {
		Axios.post('http://localhost:3001/api/usuarios', { nombre, contrasena, usuario, rol })
			.then(() => {
				navigate('/gestionar-usuarios');
				Swal.fire({
					title: 'Registro exitoso!',
					html: `<i>El usuario <strong>${nombre}</strong> se ha registrado con éxito!</i>`,
					icon: 'success',
					timer: 3000,
				});
			})
			.catch((error) => {
				console.error('Hubo un error al registrar el usuario:', error);
				Swal.fire({
					title: 'Error',
					text: 'Hubo un error al registrar el usuario. Por favor, intente de nuevo.',
					icon: 'error',
					confirmButtonText: 'Aceptar',
				});
			});
	};

	const update = () => {
		Axios.put(`http://localhost:3001/api/usuarios/${id}`, { nombre, contrasena, usuario, rol })
			.then(() => {
				navigate('/gestionar-usuarios');
				Swal.fire({
					title: 'Actualización exitosa!',
					html: `<i>El usuario <strong>${nombre}</strong> se ha actualizado con éxito!</i>`,
					icon: 'success',
					timer: 3000,
				});
			})
			.catch((error) => {
				console.error('Hubo un error al actualizar el usuario:', error);
				Swal.fire({
					title: 'Error',
					text: 'Hubo un error al actualizar el producto. Por favor, intente de nuevo.',
					icon: 'error',
					confirmButtonText: 'Aceptar',
				});
			});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (editar) {
			update();
		} else {
			add();
		}
	};

	return (
		<div className='container animate__animated animate__fadeIn my-4'>
			<div className='row justify-content-center'>
				<div className='col-md-6'>
					<div className='card shadow-sm'>
						<div className='card-body'>
							<h2 className='text-center mb-4'>{editar ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h2>
							<form onSubmit={handleSubmit}>
								<div className='mb-3'>
									<label className='form-label'>Nombre</label>
									<input
										type='text'
										value={nombre}
										onChange={(e) => setNombre(e.target.value)}
										placeholder='Ingrese el nombre'
										required
										className='form-control form-control-lg'
									/>
								</div>
								{!editar && (
									<div className='mb-3'>
										<label className='form-label'>Contraseña</label>
										<input
											type='password'
											value={contrasena}
											onChange={(e) => setContrasena(e.target.value)}
											placeholder='Ingrese la contraseña'
											required
											className='form-control form-control-lg'
										/>
									</div>
								)}
								<div className='mb-3'>
									<label className='form-label'>Nombre de Usuario</label>
									<input
										type='text'
										value={usuario}
										onChange={(e) => setUsuario(e.target.value)}
										placeholder='Ingrese el nombre de usuario'
										required
										className='form-control form-control-lg'
									/>
								</div>
								<div className='mb-3'>
									<label className='form-label'>Rol</label>
									<select value={rol} onChange={(e) => setRol(e.target.value)} className='form-select form-select-lg' required>
										<option value='' disabled>
											Seleccione un rol
										</option>
										<option value='Administrador'>Administrador</option>
										<option value='Dependiente'>Dependiente</option>
									</select>
								</div>
								<div className='d-grid'>
									<button type='submit' className='btn btn-success btn-lg'>
										{editar ? 'Actualizar' : 'Registrar'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsuarioForm;
