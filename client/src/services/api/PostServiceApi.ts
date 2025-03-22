import {SERVER_URL} from "../../components/gloabls/Constants";
import PostProp from "../../props/PostProp";

export class PostApiService {
    static async createPost(data: { title: string; description: string; imageUrl: string }): Promise<PostProp> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                imageUrls: [data.imageUrl]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        const post = await response.json();
        return new PostProp(
            post._id,
            post.userId,
            post.title,
            post.imageUrls || '',
            post.description,
            new Date().getTime()
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
            post.imageUrl || '',
            post.description,
            post.createdAt
        ));
    }

    static async updatePost(postId: string, data: { title: string; description: string; imageUrl: string }): Promise<PostProp> {
        const token = localStorage.getItem('token');

        if (!data.title || !data.description) {
            throw new Error('Title and description are required');
        }

        const response = await fetch(`${SERVER_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                imageUrls: data.imageUrl ? data.imageUrl : ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to update post' }));
            throw new Error(errorData.message || 'Failed to update post');
        }

        const post = await response.json();
        return new PostProp(
            post._id,
            post.userId.username || post.userId,
            post.title,
            post.imageUrl || '',
            post.description,
            post.createdAt || new Date().getTime()
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