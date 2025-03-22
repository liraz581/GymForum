import UserProp from '../props/UserProp';
import Mock from '../props/Mock';
import {v4 as uuidv4} from "uuid";
import {SERVER_URL} from "../components/gloabls/Constants";

export const authService = {
    async login(email: string, password: string): Promise<UserProp> {
        try {
            const response = await fetch(`${SERVER_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const { token } = await response.json();
            localStorage.setItem('token', token);

            const userResponse = await fetch(`${SERVER_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();
            return new UserProp(
                userData.id,
                userData.username,
                userData.email,
                userData.imageUrl || ''
            );
        } catch (error) {
            throw error;
        }
    },

    async register(username: string, email: string, password: string): Promise<UserProp> {
        try {
            const response = await fetch(`${SERVER_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);

            return new UserProp(
                data.user.id,
                data.user.username,
                data.user.email,
                ''
            );
        } catch (error) {
            throw error;
        }
    },

    async loginWithGoogle(): Promise<UserProp> {
        // TODO: Implement Google OAuth
        return Mock.mockUser;
    },

    async loginWithFacebook(): Promise<UserProp> {
        // TODO: Implement Facebook OAuth
        return Mock.mockUser;
    },

    logout(): void {
        localStorage.removeItem('token');
    }
};