import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { auth, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="header">
            <nav className="container">
                <div className="nav-left">
                    <Link to="/">Accueil</Link>
                    {auth && <Link to="/add">Ajouter un article</Link>}
                </div>

                <div className="nav-right">
                    {auth ? (
                        <>
                            <span>Bienvenue, {auth.prenom}</span>
                            {auth.role === 'admin' && (
                                <div className="dropdown">
                                    <button onClick={toggleDropdown}>
                                        Admin
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="dropdown-menu">
                                            <Link
                                                to="/admin/user"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Gestion Utilisateurs
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={logout}
                                className="button button-danger"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/sign">Connexion</Link>
                            <Link to="/register">Inscription</Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
