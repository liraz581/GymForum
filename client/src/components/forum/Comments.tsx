import React, { useState } from 'react';
import CommentProp from "../../props/CommentProp";

interface Comment {
    id: string;
    username: string;
    content: string;
    timestamp: number;
}

interface CommentsProps {
    postId: string;
    comments: CommentProp[];
    currentUsername: string;
    onAddComment: (content: string) => void;
    commentCount: number;
}

const Comments: React.FC<CommentsProps> = ({
                                               postId,
                                               comments,
                                               currentUsername,
                                               onAddComment,
                                           }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(newComment);
        setNewComment('');
    };

    return (
        <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Comments</h4>
            {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
            ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {comments.map(comment => (
                        <li key={comment.id} className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <img
                                    src={'https://cdn.pfps.gg/pfps/4835-spongebob-28.png'}
                                    alt={"pfp"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{comment.username}</p>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default Comments;