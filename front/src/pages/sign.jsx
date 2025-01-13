import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Sign = () => {
    const [User, setUser] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withUser: true
    });

    const handleChange = (e) => {
        setUser(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/user/sign', User);
            await login(data);
        } catch (error) {
            setError(error.response?.data?.message || "Erreur de connexion");
        }
    };

    return (
        <div>
            <h1>Connexion</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={User.email}
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
                        value={User.password}
                        onChange={handleChange}
                        placeholder="Entrez votre mot de passe"
                        required
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>
            <Link to="/register">Pas encore inscrit ? Créer un compte</Link>
        </div>
    );
};

export default Sign;
