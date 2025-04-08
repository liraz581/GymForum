export const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    EXPLORE: '/explore',
    PROFILE: '/profile'
} as const;

export const SERVER_URL: string =  process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
