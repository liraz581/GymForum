import React from "react";
import Post from './Post';
import PostProp from "../../props/PostProp";
import Mock from "../../props/Mock";
import {ForumType} from "../../types/Types";

interface ForumProps {
    type: ForumType;
}

const Forum = ({ type }: ForumProps) => {
    const mockPosts: PostProp[] = Mock.mockPosts;
    const posts = type === ForumType.MY_POSTS
        ? mockPosts.filter(post => post.username === 'liraz')
        : mockPosts.filter(post => post.username !== 'liraz');
    // TODO: replace with username, and make query to differentiate

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Forum;