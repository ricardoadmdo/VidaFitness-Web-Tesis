import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from '../components/login/Login';
import Barranavegacion from '../components/barra de navegacion/Barranavegacion';
import AgregarVenta from '../components/ventas/AgregarVenta';
import ProductForm from '../components/productos/ProductForm';
import ProductList from '../components/productos/ProductList';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import UsuarioList from '../components/usuarios/UsuarioList';
import ReporteVentas from '../components/ventas/ReporteVentas';

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<LayoutWithNav />}>
					<Route path='/reporte-venta' element={<ReporteVentas />} />
					<Route path='/gestionar-productos' element={<ProductList />} />
					<Route path='/gestionar-usuarios' element={<UsuarioList />} />
					<Route path='/agregar-venta' element={<AgregarVenta />} />
					<Route path='/usuarioform' element={<UsuarioForm />} />
					<Route path='/editUser/:id' element={<UsuarioForm />} />
					<Route path='/productform' element={<ProductForm />} />
					<Route path='/edit/:id' element={<ProductForm />} />
				</Route>
				<Route path='/' element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
};

const LayoutWithNav = () => (
	<>
		<Barranavegacion />
		<Outlet />
	</>
);

export default AppRouter;
