import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const Update = () => {
    const imgInputs = ['img', 'img1', 'img2', 'img3', 'img4'];
    const [article, setArticle] = useState({
        name: '',
        content: '',
        category: '',
        brand: '',
        price: '',
        picture: {
            img: '',
            img1: '',
            img2: '',
            img3: '',
            img4: ''
        },
        status: false,
        stock: 0
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data } = await axios.get(`/article/get/${id}`);
                setArticle(data);
            } catch (error) {
                setError(error.response?.data?.message);
            }
        };
        fetchArticle();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('img')) {
            setArticle(prev => ({
                ...prev,
                picture: {
                    ...prev.picture,
                    [name]: value
                }
            }));
        } else {
            setArticle(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/article/update/${id}`, article);
            navigate(`/detail/${id}`);
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de la mise à jour");
        }
    };

    return (
        <div>
            <h1>Modifier l'article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom:</label>
                    <input
                        type="text"
                        name="name"
                        value={article.name}
                        onChange={handleChange}
                        placeholder="Nom de l'article"
                    />
                </div>
                <div>
                    <label>Prix:</label>
                    <input
                        type="number"
                        name="price"
                        value={article.price}
                        onChange={handleChange}
                        placeholder="Prix de l'article"
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="content"
                        value={article.content}
                        onChange={handleChange}
                        placeholder="Description de l'article"
                    />
                </div>
                {imgInputs.map((imgName, index) => (
                    <div key={imgName}>
                        <label>
                            {index === 0 ?
                                'Image principale (URL):'
                                :
                                `Image ${index} (URL):`
                            }
                        </label>
                        <input
                            type="text"
                            name={imgName}
                            value={article.picture[imgName] ? article.picture[imgName] : ''}
                            onChange={handleChange}
                            placeholder={`URL de l'image ${index || 'principale'}`}
                        />
                    </div>
                ))}
                <div>
                    <label>Status:</label>
                    <input
                        type="checkbox"
                        name="status"
                        checked={article.status}
                        onChange={(e) => setArticle(prev => ({
                            ...prev,
                            status: e.target.checked
                        }))}
                    />
                </div>
                <div>
                    <label>Stock:</label>
                    <input
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
