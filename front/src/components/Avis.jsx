import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Avis = ({ articleId }) => {
  const [avis, setAvis] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(1);
  const { auth } = useContext(AuthContext);

  // Charger les avis
  const fetchAvis = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/avis/article/${articleId}`);
      setAvis(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, [articleId]);

  // Ajouter un avis
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth");
      const userData = JSON.parse(token);

      await axios.post(
        `http://localhost:8000/api/avis/add/${articleId}`,
        { comment, rating },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      fetchAvis();
      setComment("");
      setRating(1);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
    }
  };

  // Supprimer un avis
  const handleDelete = async (avisId) => {
    try {
      await axios.delete(`http://localhost:8000/api/avis/delete/${avisId}`, {
        data: { userId: auth._id, role: auth.role },
      });

      fetchAvis();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis :", error);
    }
  };

  // Modifier un avis
  const handleEdit = (avisId, currentComment, currentRating) => {
    setEditingId(avisId);
    setEditComment(currentComment);
    setEditRating(currentRating);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth");
      const userData = JSON.parse(token);

      await axios.put(
        `http://localhost:8000/api/avis/update/${editingId}`,
        { comment: editComment, rating: editRating },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      fetchAvis();
      setEditingId(null);
      setEditComment("");
      setEditRating(1);
    } catch (error) {
      console.error("Erreur lors de la modification de l'avis :", error);
    }
  };

  return (
    <div className="avis-container">
      <h3 className="avis-titre">Avis des utilisateurs</h3>

      {avis.length > 0 ? (
        avis.map((item) => (
          <div key={item._id} className="avis-item">
            {editingId === item._id ? (
              <form onSubmit={handleUpdate}>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Modifier le commentaire..."
                  required
                ></textarea>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <div className="avis-actions">
                  <button type="submit" className="btn btn-primary">
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="btn btn-danger"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="avis-user">
                  <strong>Utilisateur :</strong> {item.user?.prenom || "Anonyme"}
                </p>
                <p className="avis-rating">
                  <strong>Note :</strong> {item.rating} / 5
                </p>
                <p className="avis-comment">
                  <strong>Commentaire :</strong> {item.comment}
                </p>
                {auth && auth._id === item.user?._id && (
                  <div className="avis-actions">
                    <button
                      onClick={() => handleEdit(item._id, item.comment, item.rating)}
                      className="btn btn-primary"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-danger"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Aucun avis pour cet article.</p>
      )}

      {auth ? (
        <form onSubmit={handleSubmit} className="avis-form">
          <h4>Ajouter un avis</h4>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Écrivez votre avis..."
            required
          ></textarea>
          <button type="submit" className="btn btn-success">
            Soumettre
          </button>
        </form>
      ) : (
        <p className="avis-error">Veuillez vous connecter pour laisser un avis.</p>
      )}
    </div>
  );
};

export default Avis;
