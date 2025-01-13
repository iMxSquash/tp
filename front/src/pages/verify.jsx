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
                if (response.data.isVerified) {
                    setVerificationStatus({
                        isLoading: false,
                        error: null,
                        success: true,
                        message: response.data.message || 'Email vérifié avec succès !'
                    });
                    setTimeout(() => {
                        navigate('/sign');
                    }, 3000);
                } else {
                    throw new Error('La vérification a échoué');
                }
            } catch (error) {
                setVerificationStatus({
                    isLoading: false,
                    error: true,
                    success: false,
                    message: error.response?.data?.message || "Erreur lors de la vérification de l'email"
                });
            }
        };

        if (token) {
            verifyAccount();
        }
    }, [token, navigate]);

    if (verificationStatus.isLoading) {
        return (
            <div className="verification-container">
                <h2>Vérification de votre email en cours...</h2>
                <p>Veuillez patienter...</p>
            </div>
        );
    }

    if (verificationStatus.error) {
        return (
            <div className="verification-container">
                <h2>Échec de la vérification</h2>
                <p className="error-message">{verificationStatus.message}</p>
                <button onClick={() => navigate('/sign')}>
                    Retour à la connexion
                </button>
            </div>
        );
    }

    return (
        <div className="verification-container">
            <h2>Félicitations !</h2>
            <p>{verificationStatus.message}</p>
            <p>Redirection vers la page de connexion dans quelques secondes...</p>
        </div>
    );
};

export default Verify;
