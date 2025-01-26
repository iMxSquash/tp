import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ADD_ARTICLE_SUCCESS, FETCH_ARTICLE_ERROR, UPDATE_ARTICLE_FIELD } from '../redux/reducers/article.reducer';
import axios from 'axios';
import ImageSlider from '../components/imageSlider';

const AddArticle = () => {
    const imgInput = ['img', 'img1', 'img2', 'img3', 'img4'];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const article = useSelector(state => state.article.currentArticle) || {
        name: '',
        content: '',
        category: '',
        brand: '',
        price: 0,
        img: [],
        status: true,
        stock: 0
    };

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name.startsWith('img')) {
            dispatch(UPDATE_ARTICLE_FIELD({
                ...article,
                img: Array.isArray(article.img) ? [...article.img, files[0]] : [files[0]]
            }));
        } else {
            dispatch(UPDATE_ARTICLE_FIELD({
                ...article,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("name", article.name);
        formData.append("content", article.content);
        formData.append("category", article.category);
        formData.append("brand", article.brand);
        formData.append("price", parseInt(article.price));
        formData.append("status", article.status);
        formData.append("stock", parseInt(article.stock));

        article.img.forEach((image) => {
            formData.append("img", image);
        });

        try {
            const { data } = await api.post('/article/add', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            dispatch(ADD_ARTICLE_SUCCESS(data));
            navigate('/');
        } catch (error) {
            dispatch(FETCH_ARTICLE_ERROR(error.message));
        }
    };

    return (
        <div className="container">
            <div className="detail-container">
                <div className="detail-content">
                    <div className="add-form">
                        <h1>Ajouter un article</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        placeholder="Nom de l'article"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="content"
                                        onChange={handleChange}
                                        placeholder="Description"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="category"
                                        onChange={handleChange}
                                        placeholder="Catégorie"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="brand"
                                        onChange={handleChange}
                                        placeholder="Marque"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="price"
                                        onChange={handleChange}
                                        placeholder="Prix"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="stock"
                                        onChange={handleChange}
                                        placeholder="Stock"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="image-upload-container">
                                {imgInput.map((imgName, index) => (
                                    <div key={imgName} className="form-group">
                                        <label>
                                            {index === 0 ? "Image principale:" : `Image ${index}:`}
                                        </label>
                                        <input
                                            type="file"
                                            name={imgName}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="status"
                                        checked={article.status}
                                        onChange={e => dispatch(UPDATE_ARTICLE_FIELD({
                                            ...article,
                                            status: e.target.checked
                                        }))}
                                    />
                                    {" "}Disponible
                                </label>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Ajouter l'article
                            </button>
                        </form>
                    </div>

                    <div className="detail-info">
                        <h1>{article.name || 'Nom de l\'article'}</h1>
                        <p className="price">{article.price || '0'}€</p>
                        <p className="mb-2">{article.content || 'Description de l\'article'}</p>

                        <div className="mb-2">
                            <strong>Catégorie:</strong> {article.category || '-'}
                        </div>
                        <div className="mb-2">
                            <strong>Marque:</strong> {article.brand || '-'}
                        </div>
                        <div className="mb-2">
                            <strong>Stock:</strong> {article.stock || '0'}
                        </div>
                        <div className="mb-2">
                            <strong>Statut:</strong> {article.status ? 'Disponible' : 'Indisponible'}
                        </div>

                        {article.img && article.img.length > 0 && (
                            <div className="detail-image-container">
                                <ImageSlider images={article.img} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddArticle;