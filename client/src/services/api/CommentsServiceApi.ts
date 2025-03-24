import CommentProp from "../../props/CommentProp";
import {SERVER_URL} from "../../components/gloabls/Constants";

interface RawComment {
    _id: string;
    userId: string;
    text: string;
    timestamp: number;
    imageUrl: string;
}

export class CommentApiService {
    static async getComments(postId: string): Promise<CommentProp[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/api/posts/${postId}/comments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json() as RawComment[];

        return data.map(comment =>
            new CommentProp(
                comment._id,
                comment.userId,
                comment.text,
                comment.timestamp,
                comment.imageUrl ? `${SERVER_URL}/uploads/users/${comment.imageUrl}` : ''
            )
        );
    }

    static async addComment(postId: string, text: string, timestamp: number): Promise<CommentProp> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, timestamp }),
        });
        if (!response.ok) throw new Error('Failed to add comment');
        const data = await response.json();
        return new CommentProp(data.comment._id, data.comment.userId._id, data.comment.text, Date.now(), data.comment.imageUrl);
    }
}