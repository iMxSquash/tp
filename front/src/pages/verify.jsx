import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
    const [verificationStatus, setVerificationStatus] = useState({
        isLoading: true,
        error: null,
        success: false,
        message: ''
    });
    const { token } = useParams();
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
    });

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await api.put(`/user/verify/${token}`);
                
                if (response.data.success) {
                    setVerificationStatus({
                        isLoading: false,
                        error: null,
                        success: true,
                        message: response.data.message
                    });
                    setTimeout(() => {
                        navigate('/sign');
                    }, 3000);
                } else {
                    throw new Error(response.data.message || 'La vérification a échoué');
                }
            } catch (error) {
                console.error('Erreur complète:', error);
                setVerificationStatus({
                    isLoading: false,
                    error: true,
                    success: false,
                    message: error.response?.data?.message || error.message || "Erreur lors de la vérification de l'email"
                });
            }
        };

        if (token) {
            verifyAccount();
        }
    }, [token, navigate]);

    if (verificationStatus.isLoading) {
        return (
            <div className="container text-center">
                <div className="card">
                    <h2 className="mb-2">Vérification de votre email en cours...</h2>
                    <p>Veuillez patienter...</p>
                </div>
            </div>
        );
    }

    if (verificationStatus.error) {
        return (
            <div className="container text-center">
                <div className="card">
                    <h2 className="mb-2">Échec de la vérification</h2>
                    <p className="text-danger mb-2">{verificationStatus.message}</p>
                    <button onClick={() => navigate('/sign')} className="btn btn-primary">
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container text-center">
            <div className="card">
                <h2 className="mb-2">Félicitations !</h2>
                <p className="text-success mb-2">{verificationStatus.message}</p>
                <p>Redirection vers la page de connexion dans quelques secondes...</p>
            </div>
        </div>
    );
};

export default Verify;
