import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from 'axios';
import Loader from '../components/Loader';
import ImageSlider from '../components/ImageSlider';

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

    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;
    if (!article) return <p>Article non trouvé</p>;

    return (
        <div className="detail-container">
            <div className="detail-content">
                <div className="detail-image-container">
                    <ImageSlider
                        images={article.picture?.img ? [article.picture.img] : []}
                        baseUrl="http://localhost:8000"
                    />
                </div>

                <div className="detail-info">
                    <h1>{article.name}</h1>
                    <p className="price">{article.price}€</p>
                    <p className="mb-2">{article.content}</p>

                    <div className="mb-2">
                        <strong>Catégorie:</strong> {article.category}
                    </div>
                    <div className="mb-2">
                        <strong>Marque:</strong> {article.brand}
                    </div>
                    <div className="mb-2">
                        <strong>Stock:</strong> {article.stock}
                    </div>
                    <div className="mb-2">
                        <strong>Statut:</strong> {article.status ? 'Disponible' : 'Indisponible'}
                    </div>

                    <div className="detail-actions">
                        <button onClick={deleteArticle} className="btn btn-danger">
                            Supprimer
                        </button>
                        <Link to={`/update/${id}`} className="btn btn-primary">
                            Modifier
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;