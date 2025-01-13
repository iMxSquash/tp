import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from 'axios';

const Detail = () => {
    const dispatch = useDispatch();
    const article = useSelector((state) => state.article.currentArticle);
    const loading = useSelector((state) => state.article.loading);
    const error = useSelector((state) => state.article.error);
    const navigate = useNavigate();
    const { id } = useParams();

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    useEffect(() => {
        const fetchArticle = async () => {
            dispatch(ACTIONS.FETCH_ARTICLE_START());
            try {
                const { data } = await api.get(`/article/get/${id}`);
                dispatch(ACTIONS.FETCH_SINGLE_ARTICLE_SUCCESS(data));
            } catch (error) {
                dispatch(ACTIONS.FETCH_ARTICLE_ERROR(error.response?.data?.message));
            }
        };
        fetchArticle();
    }, [id, dispatch]);

    const deleteArticle = async () => {
        try {
            await api.delete(`/article/delete/${id}`);
            dispatch(ACTIONS.DELETE_ARTICLE_SUCCESS(id));
            navigate('/');
        } catch (error) {
            dispatch(ACTIONS.FETCH_ARTICLE_ERROR(error.response?.data?.message));
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (!article) return <p>Article non trouvé</p>;

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