import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MotionNumber from 'motion-number';

// Función para buscar productos por nombre similar
const fetchProductos = async (searchTerm) => {
	const response = await Axios.get(`http://localhost:3001/api/productos?search=${searchTerm}`);
	return response.data.productos;
};

const AgregarVenta = () => {
	const [formState, setFormState] = useState({
		productos: [],
		totalProductos: 0,
		precioTotal: 0,
		fecha: new Date(),
	});
	const [searchTerm, setSearchTerm] = useState('');

	const queryClient = useQueryClient();
	const refetchProductos = () => {
		queryClient.invalidateQueries(['productos']);
	};

	// Búsqueda de productos usando react-query
	const { data: productos = [], refetch } = useQuery({
		queryKey: ['productos', searchTerm],
		queryFn: () => fetchProductos(searchTerm),
		enabled: false, // Solo hacer la búsqueda cuando el término de búsqueda cambie
	});

	// Actualiza la búsqueda cuando el usuario escribe
	useEffect(() => {
		if (searchTerm) {
			refetch(); // Ejecutar la búsqueda al cambiar el término
		}
	}, [searchTerm, refetch]);

	const ventaMutation = useMutation({
		mutationFn: (newVenta) => Axios.post('http://localhost:3001/api/venta', newVenta),
		onSuccess: () => {
			refetchProductos();
			limpiarCampos();
			Swal.fire({
				title: '<strong>Venta registrada con éxito!</strong>',
				html: '<i>La venta fue registrada exitosamente</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Error al registrar la venta',
				text: error.response?.data?.error || 'Error desconocido al registrar la venta',
			});
		},
	});

	const limpiarCampos = () => {
		setFormState({
			productos: [],
			totalProductos: 0,
			precioTotal: 0,
			fecha: new Date(),
		});
	};

	// Función para agregar productos seleccionados y sus cantidades
	const agregarProducto = (producto, cantidad) => {
		setFormState((prevState) => {
			const nuevosProductos = [...prevState.productos];
			const index = nuevosProductos.findIndex((p) => p.uid === producto.uid);

			if (index !== -1) {
				nuevosProductos[index].cantidad += cantidad;
			} else {
				nuevosProductos.push({ ...producto, cantidad });
			}

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const eliminarProducto = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.filter((p) => p.uid !== productoId);
			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const aumentarCantidad = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.map((p) => (p.uid === productoId ? { ...p, cantidad: p.cantidad + 1 } : p));

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const disminuirCantidad = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.map((p) => (p.uid === productoId ? { ...p, cantidad: p.cantidad - 1 } : p));

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	// Validar venta
	const validarVenta = () => {
		if (formState.productos.length === 0) {
			Swal.fire({
				icon: 'error',
				title: 'No hay productos',
				text: 'Debe agregar al menos un producto a la venta',
			});
			return;
		}

		// Modal para seleccionar tipo de pago
		Swal.fire({
			title: 'Selecciona el tipo de pago',
			input: 'select',
			inputOptions: {
				Efectivo: 'Efectivo',
				Transferencia: 'Transferencia',
			},
			inputPlaceholder: 'Selecciona el tipo de pago',
			showCancelButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				const tipoPago = result.value; // Efectivo o Transferencia

				// Asegurarse de que cada producto tenga los campos requeridos
				const productosValidados = formState.productos.map((producto) => ({
					...producto,
					minimoEnAlmacen: producto.minimoEnAlmacen || 0,
					minimoEnTienda: producto.minimoEnTienda || 0,
					precioCosto: producto.precioCosto || 0,
					precio: producto.precio || 0,
				}));

				// Realizar la mutación (registro de la venta)
				ventaMutation.mutate({
					productos: productosValidados,
					totalProductos: formState.totalProductos,
					precioTotal: formState.precioTotal,
					fecha: new Date(),
					tipoPago: tipoPago, // Enviar el tipo de pago seleccionado
				});
			}
		});
	};

	// Modal para seleccionar cantidad
	const openModal = (producto) => {
		Swal.fire({
			title: 'Ingrese la cantidad',
			input: 'number',
			inputAttributes: {
				min: 1,
				autocapitalize: 'off',
			},
			inputValue: '1',
			showCancelButton: true,
			confirmButtonText: 'Agregar',
			preConfirm: (cantidad) => {
				if (!cantidad || cantidad < 1) {
					Swal.showValidationMessage('Debe ingresar una cantidad válida');
					return false;
				}
				agregarProducto(producto, parseInt(cantidad));
			},
		});
	};

	return (
		<div className='container animate__animated animate__fadeIn mt-4 my-5'>
			<h2 className='text-center mb-4'>Registrar Ventas</h2>
			<form onSubmit={(e) => e.preventDefault()} className='mb-4'>
				<div className='input-group'>
					<input
						type='text'
						className='form-control'
						placeholder='Buscar un producto...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button className='btn btn-primary' type='button' onClick={() => refetch()}>
						Buscar
					</button>
				</div>
			</form>
			<div className='row'>
				{productos.map((producto) => (
					<div key={producto.uid} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
						<div className='card h-100 shadow border-light'>
							<img
								src={producto.url}
								className='card-img-top img-fluid'
								alt={`Imagen del producto: ${producto.nombre}`}
								style={{ objectFit: 'contain', height: '200px' }}
							/>
							<div className='card-body'>
								<h5 className='card-title'>{producto.nombre}</h5>
								<p className='card-text fw-bold'>${producto.precio} CUP</p>
								{producto.cantidadTienda > 0 ? (
									<button className='btn btn-success' onClick={() => openModal(producto)}>
										Agregar
									</button>
								) : (
									<p className='card-text text-danger fw-bold' style={{ fontSize: '20px' }}>
										Producto Agotado
										<u />
									</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className='mt-4'>
				<h4>
					<u>Productos Agregados</u>
				</h4>

				<ul className='list-group'>
					{formState.productos.map((producto) => (
						<li key={producto.uid} className='list-group-item d-flex align-items-center justify-content-between'>
							<span>
								{producto.nombre} - <MotionNumber value={producto.cantidad} format='0' /> x ${producto.precio} = $
								<MotionNumber value={producto.precio * producto.cantidad} format='0,0.00' />
								CUP
							</span>
							<div className='d-flex'>
								<button
									className='btn btn-danger btn-sm ml-2'
									onClick={producto.cantidad > 1 ? () => disminuirCantidad(producto.uid) : () => eliminarProducto(producto.uid)}
								>
									<FontAwesomeIcon icon={producto.cantidad === 1 ? faTrashAlt : faMinus} />
								</button>
								<button className='btn btn-secondary btn-sm ml-2' onClick={() => aumentarCantidad(producto.uid)}>
									<FontAwesomeIcon icon={faPlus} />
								</button>
							</div>
						</li>
					))}
				</ul>
				<div className='mt-3'>
					<h5>
						Total a Pagar: $<MotionNumber value={formState.precioTotal} duration={500} format='$0,0.00' /> CUP
					</h5>
					<h5>
						Total Productos: <MotionNumber value={formState.totalProductos} format='0' /> Unidades
					</h5>
				</div>
			</div>
			<button className='btn btn-success mt-4' onClick={validarVenta}>
				Registrar Venta
				<svg xmlns='http://www.w3.org/2000/svg' width='25px' height='25px' viewBox='0 0 24 24' fill='currentColor' className='ml-2'>
					<path d='M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4zm1 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8' />
				</svg>
			</button>
		</div>
	);
};

export default AgregarVenta;
