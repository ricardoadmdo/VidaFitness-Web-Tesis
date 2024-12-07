import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UsuarioList = () => {
	const [usuarios, setUsuarios] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		getUsuarios();
	}, []);

	const getUsuarios = () => {
		Axios.get('http://localhost:3001/api/usuarios').then((response) => {
			setUsuarios(response.data.usuarios);
		});
	};

	const deleteUsuario = (usuario) => {
		Swal.fire({
			title: `¿Está seguro que desea eliminar el usuario <strong>${usuario.nombre}</strong>?`,
			text: 'El usuario será eliminado!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, eliminar!',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				Axios.delete(`http://localhost:3001/api/usuarios/${usuario.uid}`).then(() => {
					getUsuarios();
					Swal.fire({
						title: 'Usuario eliminado!',
						html: `<i>El usuario <strong>${usuario.nombre}</strong> ha sido eliminado con éxito.</i>`,
						icon: 'success',
						timer: 3000,
					});
				});
			}
		});
	};

	return (
		<div className='container animate__animated animate__fadeIn my-5'>
			<h2 className='text-center mb-4'>Lista de Usuarios</h2>
			<div className='text-center mb-4'>
				<Link to='/usuarioform' className='btn btn-success'>
					Agregar Nuevo Usuario
				</Link>
			</div>
			<table className='table table-striped table-hover'>
				<thead className='table-dark'>
					<tr>
						<th scope='col'>Nombre Completo</th>
						<th scope='col'>Nombre de usuario</th>
						<th scope='col'>Rol</th>
						<th scope='col'>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{usuarios.map((val) => (
						<tr key={val.uid}>
							<td>{val.nombre}</td>
							<td>{val.usuario}</td>
							<td>{val.rol}</td>
							<td>
								<button type='button' className='btn btn-outline-secondary me-2' onClick={() => navigate(`/editUser/${val.uid}`)}>
									<FontAwesomeIcon icon={faEdit} />
									Editar
								</button>
								<button type='button' className='btn btn-outline-danger' onClick={() => deleteUsuario(val)}>
									<FontAwesomeIcon icon={faTrashAlt} /> Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UsuarioList;
