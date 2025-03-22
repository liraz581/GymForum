import React from 'react';

interface PostProps {
    username: string;
    title: string;
    imageUrl: string;
    description: string;
    timestamp: number;
    currentUsername: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const Post: React.FC<PostProps> = ({
                                       username,
                                       title,
                                       imageUrl,
                                       description,
                                       timestamp,
                                       currentUsername,
                                       onEdit,
                                       onDelete
                                   }) => {
    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6">

            <div className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <img
                        src={'https://cdn.pfps.gg/pfps/4835-spongebob-28.png'}
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
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-auto max-h-96 object-cover rounded-md mb-4"
                    />
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
            </div>

            <div className="p-4 flex items-center gap-6 border-t border-gray-200">
                <button
                    className={`flex items-center gap-1 ${'text-gray-600'} hover:text-red-500`}
                >
                    <span className="text-lg">♥</span>
                    <span>{7}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    <span className="text-lg">💬</span>
                    <span>{7}</span>
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
        </div>
    );
};

export default Post;