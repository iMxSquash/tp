import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, updateUser } from '../../redux/reducers/user.reducer';
import axios from 'axios';

const DashboardUser = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user/get');
            dispatch(setUsers(response.data));
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.put(`http://localhost:8000/api/user/delete/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleReactivate = async (userId) => {
        try {
            await axios.put(`http://localhost:8000/api/user/reactivate/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la réactivation:', error);
        }
    };

    const handleViewDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/user/get/${userId}`);
            setSelectedUser(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails:', error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/user/update/${editingUser._id}`, formData);
            dispatch(updateUser(response.data));
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>

            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="p-2 border">Username</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Rôle</th>
                        <th className="p-2 border">Statut</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className={!user.isActive ? 'bg-gray-200' : ''}>
                            <td className="p-2 border">{user.username}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">{user.role}</td>
                            <td className="p-2 border">
                                {user.isActive ? 'Actif' : 'Inactif'}
                            </td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleViewDetails(user._id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Détails
                                </button>
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Modifier
                                </button>
                                {user.isActive ? (
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                    >
                                        Désactiver
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleReactivate(user._id)}
                                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                    >
                                        Réactiver
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-xl font-bold mb-2">Détails de l'utilisateur</h2>
                    <p>Username: {selectedUser.username}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>Rôle: {selectedUser.role}</p>
                    <p>Statut: {selectedUser.isActive ? 'Actif' : 'Inactif'}</p>
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
                    >
                        Fermer
                    </button>
                </div>
            )}

            {editingUser && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Modifier l'utilisateur</h2>
                    <form onSubmit={handleUpdate} className="space-y-2">
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="border p-2 w-full"
                            placeholder="Username"
                        />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="border p-2 w-full"
                            placeholder="Email"
                        />
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="border p-2 w-full"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Sauvegarder
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                        ></button>
                        Annuler
                    </form>
                </div>
            )}
        </div>
    );
};

export default DashboardUser;
