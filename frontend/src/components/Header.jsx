import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';


const Header = ({ isAuthenticated, onLogout }) => {
    return (
        <header>
            <div className="header-container">
                <h1>Mi Aplicación</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Inicio</Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/posts">Posts</Link>
                                </li>
                                <li>
                                    <button onClick={onLogout}>Cerrar Sesión</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/register">Registrarse</Link>
                                </li>
                                <li>
                                    <Link to="/login">Iniciar Sesión</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
