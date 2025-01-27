import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext({
    auth: null,
    login: () => { },
    logout: () => { },
    loading: true
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true
    });

    const login = async (user) => {
        try {
            const { data } = await api.post('/user/sign', user);
            localStorage.setItem('auth', JSON.stringify(data)); // Stocke le token ici
            setAuth(data);
            navigate('/');
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    };
    
    

    const logout = async () => {
        setLoading(true);
        try {
            await api.get('/user/logout');
            localStorage.removeItem('auth');
            setAuth(null);
            navigate('/sign');
            setLoading(false);
        } catch (error) {
            console.log("Erreur lors de la déconnexion:", error);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
