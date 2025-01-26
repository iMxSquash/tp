import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import React from "react";

const Header = () => {
    const { auth, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className="header">
            <nav className="nav-container">
                <div className="mobile-header">
                    {auth && (
                        <span className="user-greeting">Bienvenue, {auth.prenom}</span>
                    )}
                    <button
                        className={`burger-menu ${isMobileMenuOpen ? "open" : ""}`}
                        onClick={toggleMobileMenu}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className={`nav-content ${isMobileMenuOpen ? "active" : ""}`}>
                    <div className="nav-left">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                            Accueil
                        </Link>
                        {auth && (
                            <Link to="/add" onClick={() => setIsMobileMenuOpen(false)}>
                                Ajouter un article
                            </Link>
                        )}
                    </div>

                    <div className="nav-right">
                        {auth ? (
                            <>
                                {!isMobileMenuOpen && <span>Bienvenue, {auth.prenom}</span>}
                                {auth.role === "admin" && (
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-primary"
                                            onClick={toggleDropdown}
                                        >
                                            Admin
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="dropdown-menu">
                                                <div className="dropdown-item">
                                                    <Link
                                                        to="/admin/article"
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                </div>
                                                <div className="dropdown-item">
                                                    <Link
                                                        to="/admin/user"
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        Gestion Utilisateurs
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <button onClick={logout} className="btn btn-danger">
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <div className="auth-links">
                                <Link to="/sign" onClick={() => setIsMobileMenuOpen(false)}>
                                    Connexion
                                </Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
