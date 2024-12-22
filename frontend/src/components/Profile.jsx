import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; // Asegúrate de importar el archivo CSS

const Profile = ({ onLogout }) => {
    const [userData, setUserData] = useState(null);
    const [file, setFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Verificamos el token cuando se carga el componente
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');  // Redirige si no hay token
        } else {
            axios.get('http://localhost:8000/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`, // Corregido con backticks
                },
            })
                .then((response) => {
                    setUserData(response.data);
                    // Actualiza los campos con los datos obtenidos
                    setUsername(response.data.username);
                    setEmail(response.data.email);

                    const pictureUrl = response.data.profile_picture_url
                        ? `http://localhost:8000${response.data.profile_picture_url}` // Corregido con backticks
                        : null;
                    setProfilePicture(pictureUrl);
                })
                .catch((error) => {
                    console.error('Error al obtener el perfil:', error);
                    localStorage.removeItem('access_token');  // Elimina el token si ocurre un error
                    navigate('/login');  // Redirige al login si hay un error
                });
        }
    }, [navigate]);
    
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('profile_picture', file);

        const token = localStorage.getItem('access_token');

        // Si el token no está presente, redirigimos al login
        if (!token) {
            navigate('/login');
            return;
        }

        // Enviamos la actualización de la foto de perfil
        axios.put('http://localhost:8000/api/profile/', formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Corregido con backticks
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                setProfilePicture(`http://localhost:8000${response.data.profile_picture_url}`); // Corregido con backticks
                alert('Perfil actualizado exitosamente');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Si los datos del usuario aún no están disponibles, mostramos un cargando
    if (!userData) return <div>Cargando...</div>;

    return (
        <div className="profile-container">
            <form onSubmit={handleSubmit} className="profile-form">

                {/* Imagen de perfil */}
                <div className="profile-picture-container">
                    <img
                        className="profile-picture"
                        src={profilePicture || 'default-profile-picture.png'}
                        alt="Profile"
                    />
                </div>

                <div className="inp_nombre_profile">
                    <label>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled
                    />
                </div>

                <div className="inp_email_profile">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled
                    />
                </div>

                <div className="inp_file_profile">
                    <label>Actualizar foto de perfil:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="btn_profile">
                    <button type="submit">Actualizar perfil</button>
                </div>
            </form>

            <div className="logout-btn_profile">
                <button type="button" onClick={onLogout}>Cerrar sesión</button>
            </div>
        </div>
    );
};

export default Profile;
