class PostProp {
    _id: string;
    userId: { username: string }; // for DB
    title: string;
    imageUrl: string;
    description: string;
    createdAt: number;
    likeCount?: number;
    commentCount?: number;

    constructor(
        id: string,
        username: string,
        title: string,
        imageUrl: string,
        description: string,
        createdAt: number,
        likeCount?: number,
        commentCount?: number,
    ) {
        this._id = id
        this.userId = {username}
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
    }
}

export default PostProp;