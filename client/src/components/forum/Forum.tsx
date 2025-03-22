import React, {useEffect, useState} from "react";
import Post from './Post';
import PostForm from "./PostForm";

import PostProp from "../../props/PostProp";
import Mock from "../../props/Mock";
import {ForumType} from "../../types/Types";
import {UserApiService} from "../../services/api/UserApiService";

interface ForumProps {
    type: ForumType;
}

const Forum = ({ type }: ForumProps) => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState<PostProp | undefined>(undefined);
    const [currentUsername, setCurrentUsername] = useState<string>('');

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const userData = await UserApiService.getCurrentUser();
                setCurrentUsername(userData.username);
            } catch (err) {
                console.error('Failed to fetch user data');
            }
        };
        fetchUsername();
    }, []);

    const mockPosts: PostProp[] = Mock.mockPosts;
    const posts = type === ForumType.MY_POSTS
        ? mockPosts.filter(post => post.username === currentUsername)
        : mockPosts.filter(post => post.username !== currentUsername);
    // TODO: replace with username, and make query to differentiate

    const handleSubmit = async (data: { title: string; description: string; imageUrl: string }) => {
        if (editingPost) {
            console.log('Updating post:', data);
        } else {
            console.log('Creating post:', data);
        }
        setShowPostForm(false);
        setEditingPost(undefined);
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
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            username={post.username}
                            title={post.title}
                            imageUrl={post.imageUrl}
                            description={post.description}
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