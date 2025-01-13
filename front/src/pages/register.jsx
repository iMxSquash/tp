import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
        isActive: true
    });
    const [error, setError] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            await api.post('/user/register', formData);
            navigate('/login');
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
                    <label htmlFor="username">Nom d'utilisateur:</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
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
                        value={formData.email}
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
                        value={formData.password}
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
                        value={formData.confirmPassword}
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
