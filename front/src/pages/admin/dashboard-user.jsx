import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, updateUser } from "../../redux/reducers/user.reducer";
import axios from "axios";
import Loader from "../../components/Loader";

const DashboardUser = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    prenom: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/user/get");
      dispatch(setUsers(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/user/admin/deactivate/${userId}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la désactivation:", error);
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/user/admin/reactivate/${userId}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la réactivation:", error);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/get/${userId}`
      );
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/admin/update/${editingUser._id}`,
        formData
      );
      dispatch(updateUser(response.data));
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="text-xl">Gestion des utilisateurs</h1>
      </div>

      <div className="dashboard-table">
        <table className="table">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={!user.isActive ? "bg-gray-200" : ""}
              >
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={user.isActive ? "text-success" : "text-danger"}
                  >
                    {user.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleViewDetails(user._id)}
                    className="btn btn-primary mr-2"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="btn btn-warning mr-2"
                  >
                    Modifier
                  </button>
                  {user.isActive ? (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-danger"
                    >
                      Désactiver
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(user._id)}
                      className="btn btn-success"
                    >
                      Réactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setSelectedUser(null)}
            >
              ×
            </button>
            <h2 className="text-xl mb-2">Détails de l'utilisateur</h2>
            <div className="form-group">
              <label>Prénom:</label>
              <p>{selectedUser.prenom}</p>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <p>{selectedUser.email}</p>
            </div>
            <div className="form-group">
              <label>Rôle:</label>
              <p>{selectedUser.role}</p>
            </div>
            <div className="form-group">
              <label>Statut:</label>
              <p
                className={
                  selectedUser.isActive ? "text-success" : "text-danger"
                }
              >
                {selectedUser.isActive ? "Actif" : "Inactif"}
              </p>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setEditingUser(null)}
            >
              ×
            </button>
            <h2 className="text-xl mb-2">Modifier l'utilisateur</h2>
            <form onSubmit={handleUpdate} className="form-container">
              <div className="form-group">
                <label>Prénom:</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Rôle:</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="form-control"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success mr-2">
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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

export default DashboardUser;
