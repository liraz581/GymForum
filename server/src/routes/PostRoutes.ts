import express, { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware';
import {PostsDAL} from "../DAL/PostsDAL";
import Post from '../models/Post';
import Like from "../models/Like";
import Comment from '../models/Comment';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

const router = Router();

const postImagesDirectory = path.join(__dirname, '../uploads/posts');

// TODO: Remove?
(async () => {
    try {
        await fs.mkdir(postImagesDirectory, { recursive: true });
    } catch (error) {
        console.error('Failed to create post images directory:', error);
    }
})();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return callback(null, true);
        }
        callback(new Error("Only .png, .jpg, and .jpeg formats allowed!"));
    }
});

interface AuthenticatedRequest extends express.Request {
    user: { id: string };
    files?: Express.Multer.File[];
}

const createPost: RequestHandler = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }

        let imageUrl: string = '';
        if (req.file) {
            await fs.mkdir(postImagesDirectory, { recursive: true });

            imageUrl = `${Date.now()}-${req.file.originalname}`;

            const imagePath = path.join(
                postImagesDirectory,
                imageUrl
            );

            await sharp(req.file.buffer)
                .resize(800, 800, { fit: 'inside' })
                .toFile(imagePath);
        }

        const post = new Post({
            userId: req.user.id,
            title,
            description,
            imageUrls: imageUrl || ''
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};

const getPosts: RequestHandler = async (req, res) => {
    try {
        const posts = await PostsDAL.getPostsWithLikes(req.user.id);
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
        console.log(req.body);
        const { title, description } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }

        let imageUrl: string = '';
        if (req.file) {
            await fs.mkdir(postImagesDirectory, { recursive: true });

            imageUrl = `${Date.now()}-${req.file.originalname}`;

            const imagePath = path.join(
                postImagesDirectory,
                imageUrl
            );

            await sharp(req.file.buffer)
                .resize(800, 800, { fit: 'inside' })
                .toFile(imagePath);
        }

        const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });

        if (!post) {
            res.status(404).json({ message: 'Post not found or unauthorized' });
            return;
        }

        post.title = title;
        post.description = description;

        if (req.file) {
            post.imageUrls[0] = imageUrl;
        }

        console.log(post);

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post' });
    }
};

const deletePost: RequestHandler = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });

        if (!post) {
            res.status(404).json({ message: 'Post not found or unauthorized' });
            return;
        }

        await Like.deleteMany({ postId: post._id });
        await Comment.deleteMany({ postId: post._id });
        await Post.deleteOne({ _id: post._id });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

router.post('/', authenticateToken, upload.single('image'), createPost);
router.put('/:id', authenticateToken, upload.single('image'), updatePost);
router.get('/', authenticateToken, getPosts);
router.get('/:id', express.json(), getPostById);
router.delete('/:id', authenticateToken, express.json(), deletePost);

export default router;