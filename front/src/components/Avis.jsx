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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Avis des utilisateurs</h3>

      {/* Liste des avis */}
      {avis.length > 0 ? (
        avis.map((item) => (
          <div
            key={item._id}
            className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            {editingId === item._id ? (
              <form onSubmit={handleUpdate}>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Modifier le commentaire..."
                  required
                  className="w-full p-2 border rounded mb-2"
                ></textarea>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  className="p-2 border rounded mb-2"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p>
                  <strong>Utilisateur :</strong> {item.user?.prenom || "Anonyme"}
                </p>
                <p>
                  <strong>Note :</strong> {item.rating} / 5
                </p>
                <p>
                  <strong>Commentaire :</strong> {item.comment}
                </p>
                {auth && auth._id === item.user?._id && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(item._id, item.comment, item.rating)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
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
        <p className="text-gray-500">Aucun avis pour cet article.</p>
      )}

      {/* Formulaire d'ajout d'avis */}
      {auth ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 p-4 bg-gray-50 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold mb-3">Ajouter un avis</h4>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border rounded mb-3"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Écrivez votre avis..."
            required
            className="w-full p-2 border rounded mb-3"
          ></textarea>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          >
            Soumettre
          </button>
        </form>
      ) : (
        <p className="mt-4 text-red-500">Veuillez vous connecter pour laisser un avis.</p>
      )}
    </div>
  );
};

export default Avis;
