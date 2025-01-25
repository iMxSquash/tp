import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from 'axios';
import Loader from '../components/Loader';

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

    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1 className="text-center mb-2">Nos Articles</h1>
            <div className="grid">
                {articles.length === 0 && <p>Aucun article disponible</p>}
                {articles.map((item) => (
                    <div key={item._id} className="card">
                        <h2 className="mb-2">{item.name}</h2>
                        <Link to={`/detail/${item._id}`}>
                            <img
                                src={`http://localhost:8000${item.picture.img}`}
                                alt={item.name}
                                className="mb-2"
                            />
                        </Link>
                        <div className="flex justify-between">
                            <p className="text-center">{item.price} €</p>
                            <Link to={`/update/${item._id}`} className="btn btn-primary">
                                Modifier
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;