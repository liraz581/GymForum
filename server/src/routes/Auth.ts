import {RequestHandler, Router} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authenticateToken, JWT_SECRET} from '../middleware/AuthMiddleware';
import User from '../models/User';

const router = Router();

const register: RequestHandler = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h'
        });

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json({
            message: 'User created successfully',
            token,
            refreshToken,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h'
        });

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({
            token,
            refreshToken,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

const getMe: RequestHandler = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            const { password, ...userWithoutPassword } = user.toObject();
            res.json(userWithoutPassword);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
};

const refreshTokenHandler: RequestHandler = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token required' });
        return;
    }

    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
        ) as { id: string; email: string };

        const user = await User.findById(payload.id);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.json({ token: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

export default router;