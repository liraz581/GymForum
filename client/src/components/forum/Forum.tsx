import React, {useEffect, useState} from "react";
import Post from './Post';
import PostForm from "./PostForm";

import PostProp from "../../props/PostProp";
import {ForumType} from "../../types/Types";
import {UserApiService} from "../../services/api/UserApiService";
import {PostApiService} from "../../services/api/PostServiceApi";

interface ForumProps {
    type: ForumType;
}

const Forum = ({ type }: ForumProps) => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState<PostProp | undefined>(undefined);
    const [currentUsername, setCurrentUsername] = useState<string>('');
    const [posts, setPosts] = useState<PostProp[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userData = await UserApiService.getCurrentUser();
                setCurrentUsername(userData.username);

                const postsData = await PostApiService.getPosts();
                setPosts(postsData);
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
    // TODO: replace with username, and make query to differentiate

    const handleSubmit = async (data: { title: string; description: string; imageUrl: string }) => {
        try {
            if (editingPost) {
                // This uses optimistic approach (e.g. Instagram)
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === editingPost._id
                            ? { ...post, title: data.title, description: data.description, imageUrl: data.imageUrl }
                            : post
                    )
                );

                setShowPostForm(false);
                setEditingPost(undefined);

                await PostApiService.updatePost(editingPost._id, {
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl
                });
            } else {
                const tempId = Date.now().toString(); // note: not real ID!
                const tempPost: PostProp = {
                    _id: tempId,
                    userId: { username: currentUsername },
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    createdAt: new Date().getTime(),
                };

                setPosts(prevPosts => [tempPost, ...prevPosts]);
                setShowPostForm(false);

                const createdPostRaw = await PostApiService.createPost(data);

                const createdPost: PostProp = {
                    _id: createdPostRaw._id,
                    userId: createdPostRaw.userId,
                    title: createdPostRaw.title,
                    description: createdPostRaw.description,
                    imageUrl: '', // TODO: Replace with new URL
                    createdAt: createdPostRaw.createdAt || new Date().getTime(),
                };

                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === tempId ? createdPost : post
                    )
                );
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
                            imageUrl: editingPost.imageUrl
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
                            imageUrl={post.imageUrl}
                            description={post.description}
                            currentUsername={currentUsername}
                            timestamp={post.createdAt}
                            onEdit={() => handleEdit(post)}
                            onDelete={() => handleDelete(post._id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Forum;