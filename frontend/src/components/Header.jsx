import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = ({ isAuthenticated, profilePicture, onLogout }) => {
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
                                    {/* Si hay foto de perfil, mostrarla */}
                                    <Link to="/profile">
                                        <img
                                            src={profilePicture || 'default-profile-picture.png'} // Usa una imagen predeterminada si no hay foto
                                            alt="Perfil"
                                            className="profile-pic-header"
                                        />
                                    </Link>
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
