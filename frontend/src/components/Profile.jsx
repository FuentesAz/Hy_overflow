import { useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('profile_picture', profilePicture);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/update-profile/', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            setMessage('Imagen de perfil actualizada con éxito');
        } catch (error) {
            setMessage('Error: ' + error.response.data.error);
        }
    };

    return (
        <div className="profile-container">
            <h2>Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className="profile-picture">
                    <label>Imagen de perfil:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Actualizar perfil</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Profile;
