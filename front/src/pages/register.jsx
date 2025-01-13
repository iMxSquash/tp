import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { UPDATE_AUTH_FIELD, SET_AUTH_ERROR } from '../redux/reducers/auth.reducer';
import axios from 'axios';

const Register = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const error = useSelector(state => state.auth.error);

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    const handleChange = (e) => {
        dispatch(UPDATE_AUTH_FIELD({
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            dispatch(SET_AUTH_ERROR("Les mots de passe ne correspondent pas"));
            return;
        }
        try {
            await api.post('/user/register', user);
            window.location.href = '/login';
        } catch (error) {
            dispatch(SET_AUTH_ERROR(error.response?.data?.message || "Erreur lors de l'inscription"));
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
                        value={user.username}
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
                <button type="submit">S'inscrire</button>
            </form>
            <Link to="/sign">Déjà inscrit ? Connectez-vous</Link>
        </div>
    );
};

export default Register;
