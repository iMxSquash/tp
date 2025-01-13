import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const Detail = () => {
    const [article, setArticle] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data } = await api.get(`/article/get/${id}`);
                setArticle(data);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors du chargement");
            }
        };
        fetchArticle();
    }, [id]);

    const deleteArticle = async () => {
        try {
            await api.delete(`/article/delete/${id}`);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    return (
        <>
            <h1>Détails de l'article</h1>
            <h2>{article.name}</h2>
            <img src={article.picture.img} alt={article.name} width={200} />
            <p>{article.price}€</p>
            <p>{article.description}</p>
            <button onClick={deleteArticle}>Supprimer l'article</button>
            <Link to={`/update/${id}`}>
                <button>Modifier l'article</button>
            </Link>
        </>
    );
};

export default Detail;