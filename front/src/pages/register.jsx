import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        isActive: true,
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            await api.post('/user/register', user);
            window.location.href = '/login';
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div>
            <h1>Inscription</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom d'utilisateur:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        placeholder="Entrez votre nom d'utilisateur"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Entrez votre email"
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe:</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Entrez votre mot de passe"
                        required
                    />
                </div>
                <div>
                    <label>Confirmer le mot de passe:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirmez votre mot de passe"
                        required
                    />
                </div>
                <button type="submit">S'inscrire</button>
            </form>
            <Link to="/sign">Déjà inscrit ? Connectez-vous</Link>
        </div>
    );
};

export default Register;
