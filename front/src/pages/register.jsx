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
        <div className="container">
            <div className="form-container card">
                <h1 className="text-center mb-2">Inscription</h1>
                {error && <p className="text-danger text-center">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="prenom">Nom d'utilisateur:</label>
                        <input
                            className="form-control"
                            id="prenom"
                            type="text"
                            name="prenom"
                            value={user.prenom}
                            onChange={handleChange}
                            placeholder="Entrez votre nom d'utilisateur"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            className="form-control"
                            id="email"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe:</label>
                        <input
                            className="form-control"
                            id="password"
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
                        <input
                            className="form-control"
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmez votre mot de passe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Rôle:</label>
                        <select
                            className="form-control"
                            id="role"
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                        >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">S'inscrire</button>
                </form>
                <Link to="/sign">Déjà inscrit ? Connectez-vous</Link>
            </div>
        </div>
    );
};

export default Register;
