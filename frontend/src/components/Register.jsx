import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './registro.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');  // success or error
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Resetear el error
      
        console.log('Username:', username);  // Verifica que username no esté vacío
        console.log('Password:', password);  // Verifica que password no esté vacío
      
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password
            });
      
            console.log('Login response:', response.data);  // Verifica la respuesta de la API
      
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
        }
      };
      

    return (
        <div className='register-container'>
            <h2>Registro</h2>
            <div className='formulario'>
                <form onSubmit={handleSubmit}>
                    <div className="inp_nombre">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inp_email">
                        <label>Correo:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inp_pass">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inp_confirm_pass">
                        <label>Confirmar Contraseña:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="btn">
                        <ul>
                            <li><span>¿Ya tienes una cuenta?</span></li>
                            <li><Link to='/login'>Iniciar sesión</Link></li>
                        </ul>
                        <button type="submit">REGISTRARSE</button>
                    </div>
                </form>
                <p className={messageType}>{message}</p> {/* Mostrar mensaje con estilo */}
            </div>
        </div>
    );
};

export default Register;
