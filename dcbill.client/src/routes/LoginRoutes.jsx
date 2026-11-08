import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import Loadable from 'components/Loadable';
import { selectIsAuthenticated } from 'store/authSlice';

const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));
const VerifyEmail = Loadable(lazy(() => import('pages/auth/VerifyEmail')));

function GuestRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

const LoginRoutes = {
    path: '/',
    element: <GuestRoute />,
    children: [
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
        { path: '/verify-email', element: <VerifyEmail /> }
    ]
};

export default LoginRoutes;