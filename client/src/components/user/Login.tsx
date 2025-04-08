import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/Auth';
import {ROUTES} from "../gloabls/Constants";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            navigate(ROUTES.EXPLORE);
        } catch (err) {
            setError('Failed to login');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authService.loginWithGoogle();
            navigate(ROUTES.PROFILE);
        } catch (err) {
            setError('Failed to login with Google');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await authService.loginWithFacebook();
            navigate(ROUTES.EXPLORE);
        } catch (err) {
            setError('Failed to login with Facebook');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center">Welcome to GymForum!</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleEmailLogin} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold text-sm tracking-wide"
                    >
                        Login
                    </button>
                </form>

                <div className="flex gap-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center text-gray-700 font-semibold text-sm tracking-wide"
                    >
                        Sign in with Google
                    </button>
                    <button
                        disabled={true}
                        onClick={handleFacebookLogin}
                        className="flex-1 py-2 px-4 bg-blue-800 text-white rounded-md flex items-center justify-center font-semibold text-sm tracking-wide"
                    >
                        Sign in with Facebook
                    </button>
                </div>

                <p className="text-center">
                    Don't have an account?{' '}
                    <a href={ROUTES.REGISTER} className="text-blue-600">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;