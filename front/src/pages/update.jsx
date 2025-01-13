import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from 'axios';

const Update = () => {
    const imgInputs = ['img', 'img1', 'img2', 'img3', 'img4'];
    const dispatch = useDispatch();
    const article = useSelector(state => state.article.currentArticle);
    const loading = useSelector(state => state.article.loading);
    const error = useSelector(state => state.article.error);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('img')) {
            dispatch(ACTIONS.UPDATE_ARTICLE_FIELD({
                ...article,
                picture: {
                    ...article.picture,
                    [name]: value
                }
            }));
        } else {
            dispatch(ACTIONS.UPDATE_ARTICLE_FIELD({
                ...article,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/article/update/${id}`, article);
            dispatch(ACTIONS.UPDATE_ARTICLE_SUCCESS(data));
            navigate(`/detail/${id}`);
        } catch (error) {
            dispatch(ACTIONS.FETCH_ARTICLE_ERROR(error.response?.data?.message));
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (!article) return <p>Article non trouvé</p>;

    return (
        <div>
            <h1>Modifier l'article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nom:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={article.name}
                        onChange={handleChange}
                        placeholder="Nom de l'article"
                    />
                </div>
                <div>
                    <label htmlFor="price">Prix:</label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        value={article.price}
                        onChange={handleChange}
                        placeholder="Prix de l'article"
                    />
                </div>
                <div>
                    <label htmlFor="content">Description:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={article.content}
                        onChange={handleChange}
                        placeholder="Description de l'article"
                    />
                </div>
                {imgInputs.map((imgName, index) => (
                    <div key={imgName}>
                        <label htmlFor={imgName}>
                            {index === 0 ?
                                'Image principale (URL):' :
                                `Image ${index} (URL):`
                            }
                        </label>
                        <input
                            id={imgName}
                            type="text"
                            name={imgName}
                            value={article.picture[imgName] ? article.picture[imgName] : ''}
                            onChange={handleChange}
                            placeholder={`URL de l'image ${index || 'principale'}`}
                        />
                    </div>
                ))}
                <div>
                    <label htmlFor="status">Status:</label>
                    <input
                        id="status"
                        type="checkbox"
                        name="status"
                        checked={article.status}
                        onChange={(e) => dispatch(ACTIONS.UPDATE_ARTICLE_FIELD({
                            ...article,
                            status: e.target.checked
                        }))}
                    />
                </div>
                <div>
                    <label htmlFor="stock">Stock:</label>
                    <input
                        id="stock"
                        type="number"
                        name="stock"
                        value={article.stock}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
};

export default Update;
