import UserProp from '../props/UserProp';
import Mock from '../props/Mock';
import {v4 as uuidv4} from "uuid";

export const authService = {
    async login(email: string, password: string): Promise<UserProp> {
        // TODO: Replace with actual API call
        return Mock.mockUser;
    },

    async register(username: string, email: string, password: string, imageUrl: string): Promise<UserProp> {
        // TODO: Replace with actual API call
        return new UserProp(uuidv4(), username, email, imageUrl);
    },

    async loginWithGoogle(): Promise<UserProp> {
        // TODO: Implement Google OAuth
        return Mock.mockUser;
    },

    async loginWithFacebook(): Promise<UserProp> {
        // TODO: Implement Facebook OAuth
        return Mock.mockUser;
    }
};