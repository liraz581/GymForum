import React, { useState, useEffect } from 'react';
import UserProp from '../../props/UserProp';
import Forum from '../forum/Forum';
import { ForumType } from '../../types/Types';
import {UserApiService} from "../../services/api/UserApiService";
import Mock from "../../props/Mock";

import {styles} from "./UserProfileStyle";

const UserProfile = () => {
    const [user, setUser] = useState<UserProp | null>(null);
    const [error, setError] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await UserApiService.getCurrentUser();

                // TODO: Replace after integrating images
                if (userData.imageUrl === '') {
                    userData.imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsJeP_sxmERoOejeq3vvMR1anQOxC3eBYMBsyPE_Bbb0WWMA8ky6bmUlOTboOPFFQxSQc&usqp=CAU';
                }
                setUser(userData);
            } catch (err) {
                setError('Failed to load user profile');
            }
        };

        fetchUser();
    }, []);

    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
    if (!user) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img
                            src={user.imageUrl}
                            alt={`${user.username}'s profile`}
                            className={styles.profileImage}
                        />

                        {!isEditing && (
                            <button
                                className={styles.editButton}
                                onClick={() => setIsEditing(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.486 8.486-4.242 1.414 1.414-4.242 8.486-8.486z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div>
                        <h1 className={styles.username}>
                            {isEditing ? (
                                <input
                                    type="text"
                                    defaultValue={user.username}
                                    className="bg-white rounded px-2 py-1"
                                />
                            ) : user.username}
                        </h1>
                        <p className={styles.email}>
                            {user.email}
                        </p>
                        {isEditing && (
                            <div className="flex gap-2">
                                <button
                                    className={`${styles.button} bg-white`}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Save
                                </button>
                                <button
                                    className={`${styles.button} bg-blue-700 text-white`}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Forum type={ForumType.MY_POSTS} />
        </div>
    );
};

export default UserProfile;