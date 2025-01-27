import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../../redux/reducers/article.reducer";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardArticles = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article.articles);
  const loading = useSelector((state) => state.article.loading);
  const error = useSelector((state) => state.article.error);

  const [newArticle, setNewArticle] = useState({
    name: "",
    price: 0,
    category: "",
    content: "",
    brand: "",
    image: null,
    status: true,
    stock: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:8000/api/article",
  });

  // Récupérer les articles au chargement
  useEffect(() => {
    fetchArticles();
  }, [dispatch]);

  const fetchArticles = async () => {
    dispatch(ACTIONS.FETCH_ARTICLE_START());
    try {
      const response = await api.get("/all");
      dispatch(ACTIONS.FETCH_ARTICLE_SUCCESS(response.data));
    } catch (err) {
      dispatch(ACTIONS.FETCH_ARTICLE_ERROR(err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editMode) {
      setCurrentArticle((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewArticle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (article) => {
    setEditMode(true);
    setCurrentArticle(article);
    setNewArticle({
      name: article.name,
      price: article.price,
      category: article.category,
      content: article.content,
      brand: article.brand,
      image: article.image,
      status: article.status,
      stock: article.stock,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData();
    
    formData.append('name', currentArticle.name);
    formData.append('content', currentArticle.content);
    formData.append('category', currentArticle.category);
    formData.append('brand', currentArticle.brand);
    formData.append('price', currentArticle.price);
    formData.append('stock', currentArticle.stock);
    formData.append('status', currentArticle.status);

    if (currentArticle.image instanceof File) {
      formData.append('img', currentArticle.image);
    }

    try {
      const response = await api.put(`/admin/update/${currentArticle._id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        setEditMode(false);
        setCurrentArticle(null);
        fetchArticles();
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err.response?.data || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/admin/delete/${id}`);
      fetchArticles();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setActionLoading(true);
    try {
      const response = await api.get(`/get/${id}`);
      setSelectedArticle(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Chargement des articles...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl">Dashboard - Gestion des Articles</h1>
        <Link to="/add" className="btn btn-primary">
          Ajouter un article
        </Link>
      </div>

      {/* Tableau des articles */}
      <div className="dashboard-table mt-2">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prix</th>
              <th>Catégorie</th>
              <th>Marque</th>
              <th>Description</th>
              <th>Image</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.name}</td>
                <td>{article.price}</td>
                <td>{article.category}</td>
                <td>{article.brand}</td>
                <td>{article.content}</td>
                <td>
                  {article.picture && article.picture.img && (
                    <img
                      src={`http://localhost:8000${article.picture.img}`}
                      alt={article.name}
                      width="50"
                    />
                  )}
                </td>
                <td>{article.status}</td>
                <td>{article.stock}</td>
                <td>
                  <button
                    onClick={() => handleViewDetails(article._id)}
                    className="btn btn-primary mr-2"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleEdit(article)}
                    className="btn btn-warning mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="btn btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pour afficher les détails */}
      {selectedArticle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setSelectedArticle(null)}
              className="modal-close"
            >
              ×
            </button>
            <h2 className="text-xl mb-2">Détails de l'article</h2>
            <p className="form-group">Nom : {selectedArticle.name}</p>
            <p className="form-group">Prix : {selectedArticle.price}</p>
            <p className="form-group">Catégorie : {selectedArticle.category}</p>
            <p className="form-group">Marque : {selectedArticle.brand}</p>
            <p className="form-group">
              Description : {selectedArticle.content}
            </p>
            <p className="form-group">Image : </p>
            <img
              src={`http://localhost:8000${selectedArticle.picture?.img}`}
              alt={selectedArticle.name}
              width="200"
            />
            <p className="form-group">Status : {selectedArticle.status}</p>
            <p className="form-group">Stock : {selectedArticle.stock}</p>
          </div>
        </div>
      )}

      {currentArticle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setCurrentArticle(null)}
            >
              ×
            </button>
            <h2 className="text-xl mb-2">Modifier l'utilisateur</h2>
            {/* <form onSubmit={handleUpdate} className="form-container">
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  value={currentArticle.name}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      name: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={currentArticle.content}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      content: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      image: e.target.files[0],
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  value={currentArticle.status}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      status: e.target.value,
                    })
                  }
                  className="form-control"
                >
                  <option value="true">Disponible</option>
                  <option value="false">Indisponible</option>
                </select>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success mr-2">
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentArticle(null)}
                  className="btn btn-danger"
                >
                  Annuler
                </button>
              </div>
            </form> */}
            <form onSubmit={handleUpdate} className="form-container">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={currentArticle?.name || ""}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      name: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={currentArticle?.content || ""}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      content: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  value={currentArticle?.status}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      status: e.target.value,
                    })
                  }
                  className="form-control"
                >
                  <option value={true}>Disponible</option>
                  <option value={false}>Indisponible</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      image: e.target.files[0],
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success mr-2">
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentArticle(null)}
                  className="btn btn-danger"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardArticles;
