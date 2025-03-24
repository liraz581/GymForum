import Post from "../models/Post";
import mongoose from "mongoose";

export class PostsDAL {
    static async getPostsWithLikes(currentUserId: string): Promise<any[]> {
        try {
            return await Post.aggregate([
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_id',
                        foreignField: 'postId',
                        as: 'likes'
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'postId',
                        as: 'comments'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userId'
                    }
                },
                { $unwind: '$userId' },
                {
                    $set: {
                        'userId': { username: '$userId.username' },
                        posterImage: '$userId.imageUrl'
                    }
                },
                {
                    $set: {
                        likeCount: { $size: '$likes' },
                        isLikedByCurrentUser: {
                            $in: [new mongoose.Types.ObjectId(currentUserId), '$likes.userId']
                        },
                        commentCount: { $size: '$comments' }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        title: 1,
                        description: 1,
                        imageUrls: 1,
                        createdAt: 1,
                        likeCount: 1,
                        isLikedByCurrentUser: 1,
                        commentCount: 1,
                        posterImage: 1,
                    }
                }
            ]);
        } catch (error) {
            console.error('Error fetching posts with likes:', error);
            throw new Error('Error fetching posts from database');
        }
    }
}