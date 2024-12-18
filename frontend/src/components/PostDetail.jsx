import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/posts/${id}/`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <h3>Comments</h3>
            <ul>
                {post.comments.map(comment => (
                    <li key={comment.id}>{comment.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default PostDetail;
