import React, { useState } from 'react';

interface PostFormProps {
    onSubmit: (data: { title: string; description: string; imageUrl: string }) => void;
    onCancel: () => void;
    post?: {
        title: string;
        description: string;
        imageUrl: string;
    };
}

const PostForm = ({ post, onSubmit, onCancel }: PostFormProps) => {
    const [title, setTitle] = useState(post?.title || '');
    const [description, setDescription] = useState(post?.description || '');
    const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (post) {
            setTitle(post.title);
            setDescription(post.description);
            setImageUrl(post.imageUrl);
        }
    }, [post]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, imageUrl });
        setError('');
        setIsLoading(true);

        try {
            await onSubmit({ title, description, imageUrl });
            setTitle('');
            setDescription('');
            setImageUrl('');
        } catch (err) {
            setError('Failed to submit post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            // TODO: Handle file upload when implementing backend
                            setImageUrl(file.name); // Temporary, will need to change this
                        }
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your post here..."
                    className="w-full px-3 py-2 border rounded-md h-32"
                    required
                />

                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : post ? 'Update Post' : 'Create Post'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PostForm;