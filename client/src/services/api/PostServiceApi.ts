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
            post.imageUrls[0] || '',
            post.description,
            new Date().getTime(),
            0,
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
        console.log(posts);
        return posts.map((post: PostProp) => new PostProp(
            post._id,
            post.userId.username,
            post.title,
            post.imageUrl || '',
            post.description,
            post.createdAt,
            post.likeCount || 0,
            post.commentCount || 0
        ));
    }
}