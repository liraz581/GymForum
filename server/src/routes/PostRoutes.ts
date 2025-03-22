import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware';
import Post from '../models/Post';

const router = Router();

const createPost: RequestHandler = async (req, res) => {
    try {
        const { title, description, imageUrls } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }

        const post = new Post({
            userId: req.user.id,
            title,
            description,
            imageUrls: imageUrls || []
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};

const getPosts: RequestHandler = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

const getPostById: RequestHandler = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username');
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post' });
    }
};

const updatePost: RequestHandler = async (req, res) => {
    try {
        const { title, description, imageUrls } = req.body;
        const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });

        if (!post) {
            res.status(404).json({ message: 'Post not found or unauthorized' });
            return;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, description, imageUrls },
            { new: true }
        );

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post' });
    }
};

const deletePost: RequestHandler = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!post) {
            res.status(404).json({ message: 'Post not found or unauthorized' });
            return;
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
};

router.post('/', authenticateToken, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.patch('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

export default router;