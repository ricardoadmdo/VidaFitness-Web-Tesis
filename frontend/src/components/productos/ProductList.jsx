import { useState, useEffect } from 'react';
import Axios from 'axios';
import useFetch from '../../hooks/useFetch';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import ProductSkeleton from './ProductSkeleton';
import ErrorComponent from '../ui/ErrorComponent';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const fetchProductos = async (page, limit, search) => {
	const response = await Axios.get(`http://localhost:3001/api/productos`, {
		params: { page, limit, search },
	});
	return response.data;
};

const ProductList = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState(''); // Estado para el valor de búsqueda
	const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda usado
	const navigate = useNavigate();
	const limit = 8;

	// Hacer fetch de los productos con el término de búsqueda incluido
	const {
		data: productosData,
		isLoading,
		isError,
		error,
		refetch,
	} = useFetch(['productos', currentPage, limit, searchTerm], () => fetchProductos(currentPage, limit, searchTerm), { keepPreviousData: true });

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < (productosData?.totalPages || 0)) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const deleteProducto = async (producto) => {
		const result = await Swal.fire({
			title: `¿Está seguro que desea eliminar el producto <strong>${producto.nombre}</strong>?`,
			text: 'El producto será eliminado!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, eliminar!',
			cancelButtonText: 'Cancelar',
		});

		if (result.isConfirmed) {
			try {
				await Axios.delete(`http://localhost:3001/api/productos/${producto.uid}`);
				refetch(); // Refetch la lista de productos después de eliminar
			} catch (error) {
				console.error('Error al eliminar el producto:', error);
			}
			Swal.fire({
				title: 'Producto eliminado!',
				html: `<i>El producto <strong>${producto.nombre}</strong> ha sido eliminado con éxito.</i>`,
				icon: 'success',
				timer: 3000,
			});
		}
	};

	useEffect(() => {
		// No es necesario refetch aquí, ya que react-query maneja la recarga de datos
	}, [currentPage]);

	const handleProductoUpdated = () => {
		refetch(); // Actualiza la lista después de crear o editar un producto
	};

	// Función para manejar la búsqueda
	const handleSearch = () => {
		setSearchTerm(searchQuery);
		setCurrentPage(1); // Reiniciar la paginación al hacer una nueva búsqueda
		refetch();
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	if (isLoading) {
		return <ProductSkeleton />;
	}

	if (isError) {
		return <ErrorComponent message={error.message} />;
	}

	const productosList = productosData?.productos || [];
	const totalPages = productosData?.totalPages || 0;

	return (
		<div className='container animate__animated animate__fadeIn my-5'>
			<h2 className='text-center mb-4'>Lista de Productos</h2>

			{/* Barra de búsqueda */}
			<div className='input-group mb-4'>
				<input
					type='text'
					className='form-control'
					placeholder='Buscar producto...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyPress={handleKeyPress} // Buscar al presionar 'Enter'
				/>
				<div className='input-group-append'>
					<button className='btn btn-secondary' type='button' onClick={handleSearch}>
						Buscar
					</button>
				</div>
			</div>

			<div className='text-center mb-4'>
				<Link to='/productform' className='btn btn-success' onClick={handleProductoUpdated}>
					Agregar Nuevo Producto
				</Link>
			</div>

			<div className='row'>
				{productosList.length > 0 ? (
					productosList.map((val) => (
						<div key={val.uid} className='col-sm-6 col-md-4 col-lg-3 mb-4'>
							<div className='card h-100 shadow-lg border-light'>
								<img
									src={val.url}
									className='card-img-top img-fluid'
									alt={val.nombre}
									style={{ objectFit: 'contain', height: '200px' }}
								/>
								<div className='card-body'>
									<h5 className='card-title text-center'>{val.nombre}</h5>
									<p className='card-text'>
										<strong>Precio:</strong> ${val.precio} CUP
									</p>
									<p className='card-text'>
										<strong>Precio de Costo:</strong> ${val.precioCosto} CUP
									</p>
									{val.cantidadTienda > 0 ? (
										<p className='card-text'>
											<strong>Cantidad en Tienda:</strong> {val.cantidadTienda} Unidades
										</p>
									) : (
										<p className='card-text' style={{ color: 'red', fontWeight: 'bold', fontSize: '20px' }}>
											Producto en tienda agotado
										</p>
									)}

									{val.cantidadAlmacen > 0 ? (
										<p className='card-text'>
											<strong>Cantidad en Almacén:</strong> {val.cantidadAlmacen} Unidades
										</p>
									) : (
										<p className='card-text' style={{ color: 'red', fontWeight: 'bold', fontSize: '20px' }}>
											Producto en almacén agotado
										</p>
									)}
								</div>
								<div className='card-footer'>
									<div className='d-flex justify-content-between'>
										<button className='btn btn-outline-secondary' onClick={() => navigate(`/edit/${val.uid}`)}>
											<FontAwesomeIcon icon={faEdit} /> Editar
										</button>
										<button className='btn btn-outline-danger' onClick={() => deleteProducto(val)}>
											<FontAwesomeIcon icon={faTrashAlt} />
											Eliminar
										</button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className='col-12 text-center'>
						<p>No hay productos disponibles.</p>
					</div>
				)}
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					handlePreviousPage={handlePreviousPage}
					handleNextPage={handleNextPage}
				/>
			</div>
		</div>
	);
};

export default ProductList;
