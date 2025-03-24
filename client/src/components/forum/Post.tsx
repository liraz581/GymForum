import React, {useEffect, useState} from 'react';
import Comments from './Comments';
import {CommentApiService} from "../../services/api/CommentsServiceApi";
import CommentProp from "../../props/CommentProp";

interface PostProps {
    username: string;
    title: string;
    imageUrls: string;
    description: string;
    timestamp: number;
    currentUsername: string;
    postId: string;
    likeCount: number;
    isLikedByCurrentUser: boolean;
    comments?: CommentProp[];
    commentCount: number,
    onEdit?: () => void;
    onDelete?: () => void;
    onLike?: () => Promise<void>;
    onUnlike?: () => Promise<void>;
    userImage?: string;
    posterImage?: string;
}

const Post: React.FC<PostProps> = ({
                                       username,
                                       title,
                                       imageUrls,
                                       description,
                                       timestamp,
                                       currentUsername,
                                       postId,
                                       likeCount,
                                       isLikedByCurrentUser,
                                       comments = [],
                                       commentCount,
                                       onEdit,
                                       onDelete,
                                       onLike,
                                       onUnlike,
                                       userImage,
                                       posterImage
                                   }) => {
    const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);
    const [localLikeCount, setLocalLikeCount] = useState(likeCount);
    const [localComments, setLocalComments] = useState<CommentProp[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [localCommentCount, setLocalCommentCount] = useState(commentCount);

    const fetchComments = async () => {
        try {
            const commentsData = await CommentApiService.getComments(postId);
            setLocalComments(commentsData);
            setLocalCommentCount(commentsData.length); // Technically an override
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleCommentsToggle = async () => {
        if (!showComments) {
            await fetchComments();
        }
        setShowComments(prev => !prev);
    };

    const handleLike = async () => {
        setIsLiked(true);
        setLocalLikeCount(prev => prev + 1);
        try {
            if (onLike) await onLike();
        } catch (error) {
            setIsLiked(false);
            setLocalLikeCount(prev => prev - 1);
            console.error('Failed to like post:', error);
        }
    };

    const handleUnlike = async () => {
        setIsLiked(false);
        setLocalLikeCount(prev => prev - 1);
        try {
            if (onUnlike) await onUnlike();
        } catch (error) {
            setIsLiked(true);
            setLocalLikeCount(prev => prev + 1);
            console.error('Failed to unlike post:', error);
        }
    };

    const handleAddComment = async (text: string) => {
        const tempComment = new CommentProp(Date.now().toString(), currentUsername, text, Date.now(), userImage || '');
        setLocalComments(prev => [...prev, tempComment]);
        setLocalCommentCount(prev => prev + 1);

        try {
            const createdComment = await CommentApiService.addComment(postId, text, Date.now());
            setLocalComments(prev =>
                prev.map(c => {
                    return c.id === tempComment.id ? createdComment : c;
                })
            );
        } catch (error) {
            setLocalComments(prev => prev.filter(c => c.id !== tempComment.id));
            setLocalCommentCount(prev => prev - 1);
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6">

            <div className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <img
                        src={posterImage}
                        alt={''}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{username}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 pt-0">
                {imageUrls && (
                    <img
                        src={imageUrls}
                        alt={''}
                        className="w-full h-auto max-h-96 object-cover rounded-md mb-4"
                    />
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
            </div>

            <div className="p-4 flex items-center gap-6 border-t border-gray-200">
                <button
                    onClick={isLiked ? handleUnlike : handleLike}
                    className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
                >
                    <span className="text-lg">♥</span>
                    <span>{localLikeCount}</span>
                </button>
                <button onClick={handleCommentsToggle} className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    <span className="text-lg">💬</span>
                    <span>{localCommentCount}</span>
                </button>
                {username === currentUsername && onEdit && (
                    <>
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                        >
                            <span className="text-lg">✎</span>
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                        >
                            <span className="text-lg">🗑️</span>
                            <span>Delete</span>
                        </button>
                    </>
                )}
            </div>

            {showComments && (
                <Comments
                    postId={postId}
                    comments={localComments}
                    currentUsername={currentUsername}
                    onAddComment={handleAddComment}
                    commentCount={commentCount}
                    userImage={userImage || ''}
                />
            )}
        </div>
    );
};

export default Post;