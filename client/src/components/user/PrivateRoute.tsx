import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../gloabls/Constants';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');

    return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;