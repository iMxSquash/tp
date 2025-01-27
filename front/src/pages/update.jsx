import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from "axios";
import ImageSlider from '../components/ImageSlider';

const Update = () => {
    const dispatch = useDispatch();
    const article = useSelector((state) => state.article.currentArticle);
    const loading = useSelector((state) => state.article.loading);
    const error = useSelector((state) => state.article.error);
    const navigate = useNavigate();
    const { id } = useParams();

    const api = axios.create({
        baseURL: "http://localhost:8000/api",
        withCredentials: true,
    });

    useEffect(() => {
        const fetchArticle = async () => {
            dispatch(ACTIONS.FETCH_ARTICLE_START());
            try {
                const { data } = await api.get(`/article/get/${id}`);
                dispatch(ACTIONS.FETCH_SINGLE_ARTICLE_SUCCESS(data));
            } catch (err) {
                console.error("Erreur lors de la récupération de l'article :", err);
                dispatch(ACTIONS.FETCH_ARTICLE_ERROR(err.response?.data?.message || "Erreur serveur"));
            }
        };
        fetchArticle();
    }, [id, dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            dispatch(ACTIONS.UPDATE_ARTICLE_FIELD({ [name]: checked }));
        } else if (name.startsWith("img")) {
            dispatch(
                ACTIONS.UPDATE_ARTICLE_FIELD({
                    picture: {
                        ...article.picture,
                        [name]: value,
                    },
                })
            );
        } else {
            dispatch(ACTIONS.UPDATE_ARTICLE_FIELD({ [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedArticle = {
            ...article,
            picture: Object.values(article.picture || {})
        };

        try {
            const token = localStorage.getItem('token');
            const { data } = await api.put(`/article/admin/update/${id}`, formattedArticle, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            dispatch(ACTIONS.UPDATE_ARTICLE_SUCCESS(data));
            navigate(`/detail/${id}`);
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'article :", err);
            dispatch(ACTIONS.FETCH_ARTICLE_ERROR(err.response?.data?.message || "Erreur serveur"));
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;
    if (!article) return <p>Article non trouvé</p>;

    const imgInputs = ["img", "img1", "img2", "img3", "img4"];

    return (
        <div className="container">
            <div className="detail-container">
                <div className="detail-content">
                    <div className="add-form">
                        <h1>Modifier l'article</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={article?.name || ""}
                                        onChange={handleChange}
                                        placeholder="Nom de l'article"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={article?.content || ""}
                                        onChange={handleChange}
                                        placeholder="Description de l'article"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        id="category"
                                        type="text"
                                        name="category"
                                        value={article?.category || ""}
                                        onChange={handleChange}
                                        placeholder="Catégorie"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        id="brand"
                                        type="text"
                                        name="brand"
                                        value={article?.brand || ""}
                                        onChange={handleChange}
                                        placeholder="Marque"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={article?.price || ""}
                                        onChange={handleChange}
                                        placeholder="Prix"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        id="stock"
                                        type="number"
                                        name="stock"
                                        value={article?.stock || ""}
                                        onChange={handleChange}
                                        placeholder="Stock"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="image-upload-container">
                                {imgInputs.map((imgName, index) => (
                                    <div key={imgName} className="form-group">
                                        <label>
                                            {index === 0 ? "Image principale:" : `Image ${index}:`}
                                        </label>
                                        <input
                                            id={imgName}
                                            type="text"
                                            name={imgName}
                                            value={article.picture?.[imgName] || ""}
                                            onChange={handleChange}
                                            placeholder={`URL de l'image ${index || "principale"}`}
                                            className="form-control"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        id="status"
                                        type="checkbox"
                                        name="status"
                                        checked={article?.status || false}
                                        onChange={handleChange}
                                    />
                                    {" "}Disponible
                                </label>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Mettre à jour l'article
                            </button>
                        </form>
                    </div>

                    <div className="detail-info">
                        <h1>{article?.name || 'Nom de l\'article'}</h1>
                        <p className="price">{article?.price || '0'}€</p>
                        <p className="mb-2">{article?.content || 'Description de l\'article'}</p>

                        <div className="mb-2">
                            <strong>Catégorie:</strong> {article?.category || '-'}
                        </div>
                        <div className="mb-2">
                            <strong>Marque:</strong> {article?.brand || '-'}
                        </div>
                        <div className="mb-2">
                            <strong>Stock:</strong> {article?.stock || '0'}
                        </div>
                        <div className="mb-2">
                            <strong>Statut:</strong> {article?.status ? 'Disponible' : 'Indisponible'}
                        </div>

                        {article?.picture && Object.values(article.picture).length > 0 && (
                            <div className="detail-image-container">
                                <ImageSlider
                                    images={Object.values(article.picture)}
                                    baseUrl="http://localhost:8000"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Update;
