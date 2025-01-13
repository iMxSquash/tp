import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { UPDATE_AUTH_FIELD, SET_AUTH_ERROR } from '../redux/reducers/auth.reducer';

const Sign = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const error = useSelector(state => state.auth.error);
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        dispatch(UPDATE_AUTH_FIELD({
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login({
                email: user.email,
                password: user.password
            });
            if (!result.success) {
                dispatch(SET_AUTH_ERROR(result.error));
            }
        } catch (error) {
            dispatch(SET_AUTH_ERROR("Une erreur s'est produite lors de la connexion"));
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
