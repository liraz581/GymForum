import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/Auth';
import { ROUTES } from "../gloabls/Constants";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errorCreatingUser, setErrorCreatingUser] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.register(username, email, password, imageUrl);
            navigate(ROUTES.EXPLORE);
        } catch (err) {
            setErrorCreatingUser('Failed to register');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center">Create Account</h2>
                {errorCreatingUser && <p className="text-red-500 text-center">{errorCreatingUser}</p>}

                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="url"
                        placeholder="Profile Image URL (optional)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold text-sm tracking-wide"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center">
                    Already have an account?{' '}
                    <a href={ROUTES.LOGIN} className="text-blue-600">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;