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
        <>
        <div className="flex justify-center mb-5 banner-container">
                <img
                    src="/banniere.png"
                    alt="Bannière"
                    className="w-full max-w-5xl rounded-2xl shadow-lg banner"
                />
        </div>
        <h1 className="main-title">Le confort qui vous suit,<br />du jour à la nuit</h1>
       
        <div className="container">
            <div class="mini-title">
                <h2>En ce moment</h2>
            </div>

        
            <div class="carousel-container">
                <div class="carousel">
                    <div class="carousel-item">
                    <img src="/image1.jpg" alt="Nouveau : Shox R4" />
                    <p>Nouveau : Shox R4</p>
                    </div>
                    <div class="carousel-item">
                    <img src="/image2.jpg" alt="Cosmic Runner" />
                    <p>Cosmic Runner</p>
                    </div>
                    <div class="carousel-item">
                    <img src="/image3.jpg" alt="Survêtement Nike Tech Woven" />
                    <p>Survêtement Nike Tech Woven</p>
                    </div>
                    <div class="carousel-item">
                    <img src="/image4.jpg" alt="Jordans" />
                    <p>Jordans</p>
                    </div>
                </div>
            </div>
            <h1 className="title-home text-center mb-2">Nos Articles</h1>
            <div className="grid">
                {articles.length === 0 && <p>Aucun article disponible</p>}
                {articles.map((item) => (
                    <div key={item._id} className="card">
                        <h2 className="mb-2">{item.name}</h2>
                        <Link to={`/detail/${item._id}`}>
                            <img
                                src={item.picture && item.picture.img ? `http://localhost:8000${item.picture.img}` : `http://localhost:8000${item.picture}`}
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
        </>
    );
};

export default Home;