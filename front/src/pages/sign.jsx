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
        <div>
            <h1>Connexion</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Se connecter</button>
            </form>
            <Link to="/register">Pas encore inscrit ? Créer un compte</Link>
        </div>
    );
};

export default Sign;
