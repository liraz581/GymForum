import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware';
import Comment from '../models/Comment';
import mongoose from "mongoose";

const router = Router();

interface PopulatedUser {
    _id: mongoose.Types.ObjectId;
    username: string;
}

const createComment: RequestHandler = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;

        if (!postId || !text) {
            res.status(400).json({ message: 'Post ID and text are required' });
            return;
        }

        const newComment = new Comment({
            userId: req.user.id,
            postId,
            text,
            timestamp: Date.now()
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
};

const getCommentsByPostId: RequestHandler = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            res.status(400).json({ message: 'Post ID is required' });
            return;
        }

        const comments = await Comment.find({ postId })
            .populate<{ userId: PopulatedUser }>('userId', 'username')
            .sort({ timestamp: -1 });

        const transformedComments = comments.map(comment => ({
            _id: comment._id,
            postId: comment.postId,
            text: comment.text,
            userId: comment.userId.username,
            timestamp: comment.timestamp
        }));

        res.json(transformedComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

router.post('/posts/:postId/comments', authenticateToken, createComment);
router.get('/posts/:postId/comments', getCommentsByPostId);

export default router;