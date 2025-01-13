import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { auth, logout } = useContext(AuthContext);

    return (
        <header>
            <nav>
                <div className="nav-left">
                    <Link to="/">Accueil</Link>
                    {auth && <Link to="/add">Ajouter un article</Link>}
                </div>
                <div className="nav-right">
                    {auth ? (
                        <>
                            <span>Bienvenue, {auth.username}</span>
                            <button onClick={logout}>Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/sign">Connexion</Link>
                            <Link to="/register">Inscription</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
