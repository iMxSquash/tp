import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sign = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(user);
            if (!result.success) {
                setError(result.error);
            }
        } catch (error) {
            setError("Une erreur s'est produite lors de la connexion");
        }
    };

    return (
        <div className="container">
            <div className="form-container card">
                <h1 className="text-center mb-2">Connexion</h1>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary">Se connecter</button>
                </form>
                <Link to="/register">Pas encore inscrit ? Créer un compte</Link>
            </div>
        </div>
    );
};

export default Sign;
