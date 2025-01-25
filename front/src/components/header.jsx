import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { auth, logout } = useContext(AuthContext);

    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="flex justify-between items-center">
                <div className="nav-left">
                    <Link to="/">Accueil</Link>
                    {auth && <Link to="/add">Ajouter un article</Link>}
                </div>
                <div className="nav-right">
                    {auth ? (
                        <>
                            <span>Bienvenue, {auth.prenom}</span>
                            <button onClick={logout}>Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/sign">Connexion</Link>
                            <Link to="/register">Inscription</Link>
                        </>
                    )}
                </div>
                {auth && auth.role === 'admin' && (
                    <Link 
                        to="/admin/user" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Dashboard Admin
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
