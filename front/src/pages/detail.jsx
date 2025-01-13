import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Detail = () => {
    const [article, setArticle] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/article/get/${id}`);
                const data = await response.json();

                setArticle(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchArticle();
    }, [id]);

    const deleteArticle = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/article/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
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
            <button onClick={() => navigate(`/update/${id}`)}>Modifier l'article</button>
        </>
    );
};

export default Detail;