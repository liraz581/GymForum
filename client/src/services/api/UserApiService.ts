import UserProp from "../../props/UserProp";

export const UserApiService = {
    async getCurrentUser(): Promise<UserProp> {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/auth/me', {
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
            userData.imageUrl || ''
        );
    }
};