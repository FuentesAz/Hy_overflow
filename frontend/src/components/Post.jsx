import React, { useState } from 'react';
import './form.css'; // Asegúrate de que tienes el archivo CSS correcto

const PostForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí puedes manejar el envío del formulario, como hacer una solicitud POST al backend
        const postData = {
            title,
            description,
        };

        console.log('Enviando pregunta:', postData);

        // Limpiar el formulario después de enviar
        setTitle('');
        setDescription('');
    };

    return (
        <div className="form-container">
            <h2>Haz tu pregunta</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Escribe el título de tu pregunta"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Escribe la descripción de tu pregunta"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Enviar Pregunta</button>
            </form>
        </div>
    );
};

export default PostForm;
