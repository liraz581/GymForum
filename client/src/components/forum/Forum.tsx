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
                console.log('Updating post:', data);
            } else {
                await PostApiService.createPost(data);
            }
            setShowPostForm(false);
            setEditingPost(undefined);
        } catch (error) {
            console.error('Failed to create post:', error);
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Forum;