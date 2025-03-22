import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware';
import User from '../models/User';

const router = Router();

const updateUsername: RequestHandler = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = updatedUser.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error updating username' });
    }
};

router.patch('/', authenticateToken, updateUsername);

export default router;