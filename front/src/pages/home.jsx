import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from 'axios';

const Home = () => {
    const dispatch = useDispatch();
    const articles = useSelector((state) => state.article.articles);
    const loading = useSelector((state) => state.article.loading);
    const error = useSelector((state) => state.article.error);
    
    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
    });

    useEffect(() => {
        const fetchArticle = async () => {
            dispatch(ACTIONS.FETCH_ARTICLE_START());
            try {
                const { data } = await api.get("/article/all");
                dispatch(ACTIONS.FETCH_ARTICLE_SUCCESS(data));
            } catch (error) {
                dispatch(ACTIONS.FETCH_ARTICLE_ERROR(error.response?.data?.message));
            }
        };
        fetchArticle();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <h1>Bienvenue sur ma page d'accueil</h1>
            {articles.length === 0 && <p>Aucun article disponible</p>}
            {articles.map((item) => (
                <div key={item._id}>
                    <h2>{item.name}</h2>
                    <Link to={`/detail/${item._id}`}>
                        <img src={`http://localhost:8000${item.picture.img}`} alt={item.name} width={200} />
                    </Link>
                    <p>{item.price}</p>
                    <Link to={`/update/${item._id}`}>Update</Link>
                </div>
            ))}
        </>
    );
};

export default Home;