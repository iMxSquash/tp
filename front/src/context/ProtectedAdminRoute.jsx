import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth || auth.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
