import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const { data } = await api.get('/user/check');
    //             setAuth(data);
    //         } catch (error) {
    //             console.error("Erreur d'authentification:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     checkAuth();
    // }, []);

    const login = async (credentials) => {
        try {
            const { data } = await api.post('/user/sign', credentials);
            setAuth(data);
            navigate('/');
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || "Erreur de connexion au serveur" 
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/user/logout');
            setAuth(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
