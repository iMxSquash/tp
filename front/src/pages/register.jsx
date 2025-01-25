import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: '',
        prenom: '',
        isActive: true,
        role: 'user' // Ajout du champ role
    });
    const [error, setError] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            console.log(user);
            
            await api.post('/user/signup', user);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h1>Inscription</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="prenom">Nom d'utilisateur:</label>
                        <input
                            id="prenom"
                            type="text"
                            name="prenom"
                            value={user.prenom}
                            onChange={handleChange}
                            placeholder="Entrez votre nom d'utilisateur"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Mot de passe:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmez votre mot de passe"
                            required
                        />
                    </div>
                    <div>
                        <select
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        S'inscrire
                    </button>
                </form>
                <Link to="/sign">Déjà inscrit ? Connectez-vous</Link>
            </div>
        </div>
    );
};

export default Register;
