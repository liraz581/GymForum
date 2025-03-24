import {SERVER_URL} from "../../components/gloabls/Constants";
import PostProp from "../../props/PostProp";

export class PostApiService {
    static async createPost(data: { title: string; description: string; image: File | null }): Promise<PostProp> {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await fetch(`${SERVER_URL}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (!response.ok) {
            console.error('Server error:', response.status, response.text);
            throw new Error('Failed to create post');
        }

        const post = await response.json();
        return new PostProp(
            post._id,
            post.userId,
            post.title,
            post.imageUrls || null,
            post.description,
            new Date().getTime(),
            0
        );
    }

    static async getPosts(): Promise<PostProp[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const posts = await response.json();

        return posts.map((post: PostProp) => new PostProp(
            post._id,
            post.userId.username,
            post.title,
            (post.imageUrls[0] ? `${SERVER_URL}/uploads/posts/${post.imageUrls}` : ''),
            post.description,
            post.createdAt,
            post.likeCount,
            post.isLikedByCurrentUser,
            post.commentCount,
            (post.posterImage ? `${SERVER_URL}/uploads/users/${post.posterImage}` : ''),
        ));
    }

    static async updatePost(postId: string, data: { title: string; description: string; image: File | null }): Promise<PostProp> {
        const token = localStorage.getItem('token');

        if (!data.title || !data.description) {
            throw new Error('Title and description are required');
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await fetch(`${SERVER_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to update post' }));
            throw new Error(errorData.message || 'Failed to update post');
        }

        const post = await response.json();

        // TODO: fix image not showing up for some reason
        return new PostProp(
            post._id,
            post.userId,
            post.title,
            (post.imageUrls[0] ? `${SERVER_URL}/uploads/posts/${post.imageUrls}` : ''),
            post.description,
            post.createdAt || new Date().getTime(),
            post.likeCount
        );
    }

    static async deletePost(postId: string): Promise<void> {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token is missing');
        }

        const response = await fetch(`${SERVER_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to delete post' }));
            throw new Error(errorData.message || 'Failed to delete post');
        }

        await response.json();
    }
}