class UserProp {
    userId: string;
    username: string;
    email: string;
    imageUrl: string;

    constructor(userId: string, username: string, email: string, imageUrl: string) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.imageUrl = imageUrl;
    }
}

export default UserProp;