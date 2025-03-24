import React, {useEffect, useState} from "react";
import Post from './Post';
import PostForm from "./PostForm";

import PostProp from "../../props/PostProp";
import {ForumType} from "../../types/Types";
import {UserApiService} from "../../services/api/UserApiService";
import {PostApiService} from "../../services/api/PostServiceApi";
import {LikeServiceApi} from "../../services/api/LikeServiceApi";
import {SERVER_URL} from "../gloabls/Constants";

interface ForumProps {
    type: ForumType;
}

interface LikeState {
    [postId: string]: { isLiked: boolean; count: number };
}

const Forum = ({ type }: ForumProps) => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState<PostProp | undefined>(undefined);
    const [currentUsername, setCurrentUsername] = useState<string>('');
    const [posts, setPosts] = useState<PostProp[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likes, setLikes] = useState<LikeState>({});
    const [userImage, setUserImage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userData = await UserApiService.getCurrentUser();
                setCurrentUsername(userData.username);
                setUserImage(userData.imageUrl);

                const postsData = await PostApiService.getPosts();
                setPosts(postsData);

                const initialLikes: LikeState = {};
                postsData.forEach(post => {
                    initialLikes[post._id] = {
                        isLiked: post.isLikedByCurrentUser || false,
                        count: post.likeCount || 0
                    };
                });
                setLikes(initialLikes);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredPosts = type === ForumType.MY_POSTS
        ? posts.filter(post => post.userId.username === currentUsername)
        : posts.filter(post => post.userId.username !== currentUsername);

    const handleSubmit = async (data: { title: string; description: string; image: File | null }) => {
        try {
            if (editingPost) {
                // This uses optimistic approach (e.g. Instagram)
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === editingPost._id
                            ? { ...post, title: data.title, description: data.description, imageUrls: '' }
                            : post
                    )
                );

                setShowPostForm(false);
                setEditingPost(undefined);

                const editedPost = await PostApiService.updatePost(editingPost._id, {
                    title: data.title,
                    description: data.description,
                    image: data.image
                });

                setPosts(prevPosts => [editedPost, ...prevPosts]);
            } else {
                const tempId = Date.now().toString(); // note: not real ID!
                const tempPost = {
                    _id: tempId,
                    userId: { username: currentUsername },
                    title: data.title,
                    description: data.description,
                    imageUrls: '',
                    createdAt: new Date().getTime(),
                    likeCount: 0,
                    isLikedByCurrentUser: false
                };

                setPosts(prevPosts => [tempPost, ...prevPosts]);
                setShowPostForm(false);

                const createdPostRaw: PostProp = await PostApiService.createPost(data);

                const createdPost: PostProp = {
                    _id: createdPostRaw._id,
                    commentCount: createdPostRaw.commentCount,
                    userId: { username: currentUsername },
                    title: createdPostRaw.title,
                    description: createdPostRaw.description,
                    imageUrls: createdPostRaw.imageUrls[0] ? `${SERVER_URL}/uploads/posts/${createdPostRaw.imageUrls}` : '',
                    isLikedByCurrentUser: createdPostRaw.isLikedByCurrentUser,
                    createdAt: createdPostRaw.createdAt || new Date().getTime(),
                    likeCount: 0
                };

                setPosts(prevPosts => [createdPost, ...prevPosts.slice(1)]);

                setLikes(prevLikes => {
                    const newLikes = { ...prevLikes, [createdPost._id]: { isLiked: false, count: 0 } };
                    delete newLikes[tempId];
                    return newLikes;
                });
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            // Optimistic approach
            setPosts(posts.filter(post => post._id !== postId));
            await PostApiService.deletePost(postId);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            // Optimistic update
            setLikes(prevLikes => ({
                ...prevLikes,
                [postId]: {
                    isLiked: true,
                    count: prevLikes[postId].count + 1
                }
            }));

            await LikeServiceApi.likePost(postId);
        } catch (error) {
            console.error('Failed to like post:', error);
            setLikes(prevLikes => ({
                ...prevLikes,
                [postId]: {
                    isLiked: false,
                    count: prevLikes[postId].count - 1
                }
            }));
            setError('Failed to like post. Please try again.');
        }
    };

    const handleUnlike = async (postId: string) => {
        try {
            // Optimistic update
            setLikes(prevLikes => ({
                ...prevLikes,
                [postId]: {
                    isLiked: false,
                    count: prevLikes[postId].count - 1
                }
            }));

            await LikeServiceApi.unlikePost(postId);
        } catch (error) {
            console.error('Failed to unlike post:', error);
            setLikes(prevLikes => ({
                ...prevLikes,
                [postId]: {
                    isLiked: true,
                    count: prevLikes[postId].count + 1
                }
            }));
            setError('Failed to unlike post. Please try again.');
        }
    };

    const handleEdit = (post: PostProp) => {
        setEditingPost(post);
        setShowPostForm(true);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowPostForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create Post
                </button>
            </div>

            {showPostForm && (
                <div className="mb-6">
                    <PostForm
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowPostForm(false);
                            setEditingPost(undefined);
                        }}
                        post={editingPost ? {
                            title: editingPost.title,
                            description: editingPost.description,
                            imageUrls: editingPost.imageUrls
                        } : undefined}
                    />
                </div>
            )}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                    {type === ForumType.ALL_POSTS ? 'Explore Posts' : 'Your Posts'}
                </h2>
                <div className="space-y-6">
                    {filteredPosts.map((post: PostProp) => (
                        <Post
                            key={post._id}
                            username={post.userId.username}
                            title={post.title}
                            imageUrls={post.imageUrls}
                            description={post.description}
                            currentUsername={currentUsername}
                            postId={post._id}
                            timestamp={post.createdAt}
                            likeCount={post.likeCount || 0}
                            isLikedByCurrentUser={post.isLikedByCurrentUser || false}
                            commentCount={post.commentCount || 0}
                            onEdit={() => handleEdit(post)}
                            onDelete={() => handleDelete(post._id)}
                            onLike={() => handleLike(post._id)}
                            onUnlike={() => handleUnlike(post._id)}
                            userImage={userImage}
                            posterImage={post.posterImage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Forum;