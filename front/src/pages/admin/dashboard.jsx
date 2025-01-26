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

  // const handleAdd = async (e) => {
  //   e.preventDefault();
  //   setActionLoading(true);
  //   try {
  //     await api.post("/add", newArticle);
  //     setNewArticle({
  //       name: "",
  //       price: 0,
  //       category: "",
  //       content: "",
  //       brand: "",
  //       image: null,
  //       status: true,
  //       stock: 0,
  //     });
  //     fetchArticles();
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  const handleEdit = (article) => {
    setEditMode(true);
    setCurrentArticle(article);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put(`/update/${currentArticle._id}`, currentArticle);
      setEditMode(false);
      setCurrentArticle(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/delete/${id}`);
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
                  {article.image && (
                    <img
                      src={`http://localhost:8000${article.image}`}
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

      {/* Modal pour afficher les détails */}
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
              src={`http://localhost:8000${selectedArticle.image}`}
              alt={selectedArticle.name}
              width="200"
            />
            <p className="form-group">Statut : {selectedArticle.status}</p>
            <p className="form-group">Stock : {selectedArticle.stock}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardArticles;
