import UserProp from "../../props/UserProp";
import {SERVER_URL} from "../../components/gloabls/Constants";

export const UserApiService = {
    async getCurrentUser(): Promise<UserProp> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        return new UserProp(
            userData.id,
            userData.username,
            userData.email,
            userData.imageUrl ? `${SERVER_URL}/uploads/users/${userData.imageUrl}` : ''
        );
    },

    async updateUsername(username: string): Promise<UserProp> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/user/username`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            throw new Error('Failed to update username');
        }

        const userData = await response.json();
        return new UserProp(
            userData.id,
            userData.username,
            userData.email,
            userData.imageUrl ? `${SERVER_URL}/uploads/users/${userData.imageUrl}` : ''
        );
    },

    async updateImage(img: File | null): Promise<UserProp> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const formData = new FormData();
        if (img) {
            formData.append('image', img);
        }

        const response = await fetch(`${SERVER_URL}/user/image`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update image');
        }

        const userData = await response.json();
        return new UserProp(
            userData.id,
            userData.username,
            userData.email,
            userData.imageUrl ? `${SERVER_URL}/uploads/users/${userData.imageUrl}` : ''
        );
    }
};