import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa'; // Import an icon

const cloudName = import.meta.env.VITE_CLOUDNAME;
const uploadPreset = import.meta.env.VITE_UPLOADPRESET;

const ProductForm = () => {
	const [nombre, setNombre] = useState('');
	const [precio, setPrecio] = useState('');
	const [precioCosto, setPrecioCosto] = useState('');
	const [cantidadTienda, setCantidadTienda] = useState('');
	const [cantidadAlmacen, setCantidadAlmacen] = useState('');
	const [url, setUrl] = useState('');
	const [file, setFile] = useState(null);
	const [editar, setEditar] = useState(false);
	const [uploading, setUploading] = useState(false); // State to manage uploading
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			setEditar(true);
			getProducto(id);
		}
	}, [id]);

	const getProducto = (id) => {
		Axios.get(`http://localhost:3001/api/productos/${id}`)
			.then((response) => {
				const producto = response.data;
				setNombre(producto.nombre);
				setPrecio(producto.precio);
				setPrecioCosto(producto.precioCosto);
				setCantidadTienda(producto.cantidadTienda);
				setCantidadAlmacen(producto.cantidadAlmacen);
				setUrl(producto.url);
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: 'Hubo un error al obtener el producto.',
					error,
					icon: 'error',
					confirmButtonText: 'Aceptar',
				});
			});
	};

	const uploadImageToCloudinary = async () => {
		setUploading(true); // Set uploading state to true
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', uploadPreset);

		try {
			const response = await Axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
			setUploading(false); // Set uploading state to false
			return response.data.secure_url;
		} catch (error) {
			setUploading(false); // Set uploading state to false
			Swal.fire({
				title: 'Error',
				text: 'Hubo un error al subir la imagen.',
				icon: 'error',
				confirmButtonText: 'Aceptar',
			});
			return null;
		}
	};

	const add = async () => {
		let imageUrl = url;
		if (file) {
			imageUrl = await uploadImageToCloudinary();
		}

		Axios.post('http://localhost:3001/api/productos', { nombre, precio, url: imageUrl, precioCosto, cantidadAlmacen, cantidadTienda })
			.then(() => {
				navigate('/gestionar-productos');
				Swal.fire({
					title: 'Registro exitoso!',
					html: `<i>El producto <strong>${nombre}</strong> se ha registrado con éxito!</i>`,
					icon: 'success',
					timer: 3000,
				});
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: 'Hubo un error al registrar el producto.',
					error,
					icon: 'error',
					confirmButtonText: 'Aceptar',
				});
			});
	};

	const update = async () => {
		let imageUrl = url;
		if (file) {
			imageUrl = await uploadImageToCloudinary();
		}

		Axios.put(`http://localhost:3001/api/productos/${id}`, { nombre, url: imageUrl, precio, precioCosto, cantidadAlmacen, cantidadTienda })
			.then(() => {
				navigate('/gestionar-productos');
				Swal.fire({
					title: 'Actualización exitosa!',
					html: `<i>El producto <strong>${nombre}</strong> se ha actualizado con éxito!</i>`,
					icon: 'success',
					timer: 3000,
				});
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: 'Hubo un error al actualizar el producto.',
					error,
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

	const onDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0]);
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<div className='container my-4'>
			<div className='row justify-content-center'>
				<div className='col-md-6'>
					<div className='card shadow-sm'>
						<div className='card-body'>
							<h2 className='text-center mb-4'>{editar ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
							<form onSubmit={handleSubmit}>
								<div className='mb-3'>
									<label className='form-label'>Nombre</label>
									<input
										type='text'
										value={nombre}
										onChange={(e) => {
											const regex = /^[a-zA-Z\s]*$/;
											if (regex.test(e.target.value)) {
												setNombre(e.target.value);
											}
										}}
										placeholder='Ingrese el nombre'
										required
										className='form-control'
									/>
								</div>

								<div className='mb-3'>
									<label className='form-label'>Precio</label>
									<input
										type='number'
										value={precio}
										onChange={(e) => setPrecio(e.target.value)}
										placeholder='Ingrese el precio'
										required
										className='form-control'
									/>
								</div>
								<div className='mb-3'>
									<label className='form-label'>Precio de Costo</label>
									<input
										type='number'
										value={precioCosto}
										onChange={(e) => setPrecioCosto(e.target.value)}
										placeholder='Ingrese el precio de costo'
										required
										className='form-control'
									/>
								</div>
								<div className='mb-3'>
									<label className='form-label'>Cantidad en Tienda</label>
									<input
										type='number'
										value={cantidadTienda}
										onChange={(e) => setCantidadTienda(e.target.value)}
										placeholder='Ingrese la cantidad en tienda'
										required
										className='form-control'
									/>
								</div>
								<div className='mb-3'>
									<label className='form-label'>Cantidad en Almacén</label>
									<input
										type='number'
										value={cantidadAlmacen}
										onChange={(e) => setCantidadAlmacen(e.target.value)}
										placeholder='Ingrese la cantidad en almacén'
										required
										className='form-control'
									/>
								</div>
								<div className='mb-3'>
									<label className='form-label'>Imagen del Producto</label>
									<div {...getRootProps({ className: 'dropzone border p-4 text-center' })}>
										<input {...getInputProps()} />
										<FaUpload className='mb-2' size={50} color='#007BFF' /> {/* Image icon */}
										<p>{file ? `Archivo seleccionado: ${file.name}` : 'Arrastra una imagen o haz clic para seleccionarla'}</p>
									</div>
									{uploading && <p className='text-info'>Subiendo imagen, por favor espera...</p>} {/* Loading message */}
								</div>
								<div className='d-grid'>
									<button type='submit' className='btn btn-success'>
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

export default ProductForm;
