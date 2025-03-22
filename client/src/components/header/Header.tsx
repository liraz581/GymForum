import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/Auth';
import {ROUTES} from "../gloabls/Constants";

interface Route {
    path: string;
    label: string;
}

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const routes: Route[] = [
        { path: ROUTES.EXPLORE, label: 'Explore' },
        { path: ROUTES.PROFILE, label: 'Profile' },
        { path: ROUTES.LOGIN, label: 'Logout' }
    ];

    return (
        <nav className="sticky top-0 bg-white shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center items-center h-16 space-x-8">
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            onClick={route.label === 'Logout' ? (e) => {
                                e.preventDefault();
                                authService.logout();
                                navigate(ROUTES.LOGIN);
                            } : undefined}
                            className={`px-4 py-2 text-base font-bold ${
                                location.pathname === route.path
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {route.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}