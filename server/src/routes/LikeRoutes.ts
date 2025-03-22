import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware';
import Like from '../models/Like';

const router = Router();

const createLike: RequestHandler = async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            res.status(400).json({ message: 'Post ID is required' });
            return;
        }

        const newLike = new Like({
            userId: req.user.id,
            postId: postId
        });

        await newLike.save();
        res.status(201).json({ message: 'Post liked successfully', like: newLike });
    } catch (error) {
        res.status(500).json({ message: 'Error liking post' });
    }
};

const deleteLike: RequestHandler = async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            res.status(400).json({ message: 'Post ID is required' });
            return;
        }

        const deletedLike = await Like.findOneAndDelete({
            userId: req.user.id,
            postId: postId
        });

        if (!deletedLike) {
            res.status(404).json({ message: 'Like not found or unauthorized' });
            return;
        }

        res.json({ message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing like' });
    }
};

router.post('/', authenticateToken, createLike);
router.delete('/', authenticateToken, deleteLike);

export default router;