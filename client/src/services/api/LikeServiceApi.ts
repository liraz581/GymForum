import {SERVER_URL} from "../../components/gloabls/Constants";

export class LikeServiceApi {
    static async likePost(postId: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/likes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId })
        });
        if (!response.ok) {
            throw new Error('Failed to like post');
        }
        return response.json();
    }

    static async unlikePost(postId: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/likes`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId })
        });
        if (!response.ok) {
            throw new Error('Failed to unlike post');
        }
        return response.json();
    }
}