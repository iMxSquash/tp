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
        <header className="bg-gray-800 text-white p-4">
            <nav className="flex justify-between items-center relative">
                <div className="nav-left">
                    <Link to="/" className="mr-4">Accueil</Link>
                    {auth && <Link to="/add" className="mr-4">Ajouter un article</Link>}
                </div>

                <div className="nav-right flex items-center gap-4">
                    {auth ? (
                        <>
                            <span className="mr-4">Bienvenue, {auth.prenom}</span>
                            {auth.role === 'admin' && (
                                <div className="relative">
                                    <button 
                                        onClick={toggleDropdown}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                    >
                                        Admin
                                        <svg 
                                            className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                            <Link 
                                                to="/admin/user" 
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
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
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/sign" className="hover:text-gray-300">Connexion</Link>
                            <Link to="/register" className="hover:text-gray-300">Inscription</Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
