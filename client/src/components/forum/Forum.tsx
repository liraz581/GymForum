import React from "react";
import Post from "./Post";
import PostProp from "../../props/PostProp";
import Mock from "../../props/Mock";

const mockPosts: PostProp[] = Mock.mockPosts // TODO: Replace with real posts

const Forum: React.FC = () => {
    return (
        <div className="p-4 bg-teal-70 min-h-screen">
            {mockPosts.map((post, index) => (
                <Post
                    key={index}
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