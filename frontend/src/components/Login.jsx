import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Resetear el error

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
            username,
            password
        });

        // Guardar los tokens en localStorage
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Actualizar el estado de autenticación
        setAuth(true);

        // Redirigir al perfil
        navigate('/profile');
    } catch (error) {
        // Manejo de errores
        if (error.response) {
            // Errores desde el backend
            setError(error.response.data.error || 'Credenciales incorrectas. Intenta de nuevo.');
        } else if (error.request) {
            // Error de red
            setError('Error al conectar con el servidor. Intenta de nuevo más tarde.');
        } else {
            // Otros errores
            setError('Ocurrió un error desconocido.');
        }
        console.error(error);
        console.log(username, password)
    }
};

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <div className="formulario">
        <form onSubmit={handleSubmit}>
          <div className="inp_nombre">
            <label>Nombre de usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="inp_pass">
            <label htmlFor="">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}  {/* Mostrar mensaje de error */}
          <div className="btn">
            <ul>
              <li><span>¿Aún no tienes una cuenta?</span></li>
              <li><Link to="/register">Registrarse</Link></li>
            </ul>
            <button type="submit">INICIAR SESIÓN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
