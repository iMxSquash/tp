import React, { useState } from 'react';
import axios from 'axios';

const AddArticle = () => {
    const imgInput = ['img', 'img1', 'img2', 'img3', 'img4'];
    const [article, setArticle] = useState({
        name: '',
        content: '',
        category: '',
        brand: '',
        price: 0,
        img: [],
        status: true,
        stock: 0
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name.startsWith('img')) {
            setArticle(prev => ({
                ...prev,
                img: files ? [...prev.img, files[0]] : prev.img,
            }));
        } else {
            setArticle(prev => ({ ...prev, [name]: value }));
        }
    }

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
            const response = await axios.post(
                `http://localhost:8000/api/article/add`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            <h1>ADD ARTICLE</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    placeholder="Nom de l'article"
                    required
                />
                <textarea
                    name="content"
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
                <input
                    type="text"
                    name="category"
                    onChange={handleChange}
                    placeholder="Catégorie"
                    required
                />
                <input
                    type="text"
                    name="brand"
                    onChange={handleChange}
                    placeholder="Marque"
                    required
                />
                <input
                    type="number"
                    name="price"
                    onChange={handleChange}
                    placeholder="Prix"
                    required
                />
                {imgInput.map((imgName, index) => (
                    <div key={imgName}>
                        <label>
                            {index === 0 ? "Image principale (URL):" : `Image ${index} (URL):`}
                        </label>
                        <input
                            type="file"
                            name={imgName}
                            onChange={handleChange}
                            placeholder={`Image ${imgName.slice(-1)}`}
                        />
                    </div>
                ))}
                <input
                    type="number"
                    name="stock"
                    onChange={handleChange}
                    placeholder="Stock"
                    required
                />
                <input
                    type="checkbox"
                    name="status"
                    checked={article.status}
                    onChange={e => setArticle(prev => (
                        { ...prev, status: e.target.checked }
                    ))}
                />

                <button>Ajouter l'article</button>
            </form>
        </>
    );
};
export default AddArticle;