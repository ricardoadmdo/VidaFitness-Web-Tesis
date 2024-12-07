import { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import './barranavegacion.css';
import { types } from '../../types/types';
import logo from '../../images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faFileInvoice, faCashRegister, faBoxes, faUserCog } from '@fortawesome/free-solid-svg-icons';

const Barranavegacion = () => {
	const { user, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const sidebarRef = useRef(null);
	const buttonRef = useRef(null);

	const handleLogout = () => {
		dispatch({ type: types.logout });
		navigate('/', { replace: true });
	};

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event) => {
		if (sidebarRef.current && !sidebarRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			<nav className={`navbar navbar-expand-lg ${isOpen ? 'shifted' : ''}`}>
				<div className='container-fluid d-flex align-items-center'>
					<button className='menu-btn' type='button' onClick={toggleSidebar} ref={buttonRef}>
						☰
					</button>
					<span className='navbar-brand mb-0 h1 d-flex align-items-center'>
						<NavLink className='navbar-brand' to='/reporte-venta'>
							<img className='d-inline-block align-text-top' src={logo} alt='Logo' height='35' />
						</NavLink>
						Tienda Vida Fitness
					</span>

					<ul className='navbar-nav'>
						{user.logged ? (
							<li className='nav-item'>
								<button className='nav-link' onClick={handleLogout}>
									<FontAwesomeIcon icon={faSignOutAlt} />
									Cerrar Sesión
								</button>
							</li>
						) : (
							<li className='nav-item'>
								<NavLink className='nav-link' to='/reporte-venta'>
									<FontAwesomeIcon icon={faUser} />
									Iniciar Sesión
								</NavLink>
							</li>
						)}
					</ul>
				</div>
			</nav>
			<div ref={sidebarRef} className={`d-flex flex-column vh-100 sidebar ${isOpen ? 'open' : ''}`}>
				<nav className='nav flex-column mt-3'>
					<NavLink to='/reporte-venta' className='nav-link'>
						<FontAwesomeIcon icon={faFileInvoice} className='me-2' />
						Reporte de Ventas
					</NavLink>

					<NavLink to='/agregar-venta' className='nav-link'>
						<FontAwesomeIcon icon={faCashRegister} className='me-2' />
						Agregar Ventas
					</NavLink>

					{user.rol === 'Administrador' && (
						<>
							<NavLink to='/gestionar-productos' className='nav-link'>
								<FontAwesomeIcon icon={faBoxes} className='me-2' />
								Gestionar Productos
							</NavLink>
							<NavLink to='/gestionar-usuarios' className='nav-link'>
								<FontAwesomeIcon icon={faUserCog} className='me-2' />
								Gestionar Usuarios
							</NavLink>
						</>
					)}
				</nav>
			</div>
			<div className={`content ${isOpen ? 'shifted' : ''}`}></div>
		</>
	);
};

export default Barranavegacion;
