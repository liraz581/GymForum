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
        <div className="p-4 bg-teal-70 min-h-screen">
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
    );
};

export default Forum;