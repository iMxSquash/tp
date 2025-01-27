import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from "axios";

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
        <div>
            <h1>Modifier l'article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nom :</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={article?.name || ""}
                        onChange={handleChange}
                        placeholder="Nom de l'article"
                    />
                </div>
                <div>
                    <label htmlFor="price">Prix :</label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        value={article?.price || ""}
                        onChange={handleChange}
                        placeholder="Prix de l'article"
                    />
                </div>
                <div>
                    <label htmlFor="content">Description :</label>
                    <textarea
                        id="content"
                        name="content"
                        value={article?.content || ""}
                        onChange={handleChange}
                        placeholder="Description de l'article"
                    />
                </div>
                {imgInputs.map((imgName, index) => (
                    <div key={imgName}>
                        <label htmlFor={imgName}>
                            {index === 0
                                ? "Image principale (URL) :"
                                : `Image ${index} (URL) :`}
                        </label>
                        <input
                            id={imgName}
                            type="text"
                            name={imgName}
                            value={article.picture?.[imgName] || ""}
                            onChange={handleChange}
                            placeholder={`URL de l'image ${index || "principale"}`}
                        />
                    </div>
                ))}
                <div>
                    <label htmlFor="status">Status :</label>
                    <input
                        id="status"
                        type="checkbox"
                        name="status"
                        checked={article?.status || false}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="stock">Stock :</label>
                    <input
                        id="stock"
                        type="number"
                        name="stock"
                        value={article?.stock || ""}
                        onChange={handleChange}
                        placeholder="Quantité en stock"
                    />
                </div>
                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
};

export default Update;
