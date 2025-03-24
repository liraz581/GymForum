class PostProp {
    _id: string;
    userId: { username: string }; // for DB
    title: string;
    imageUrls: string;
    description: string;
    createdAt: number;
    likeCount?: number;
    isLikedByCurrentUser?: boolean;
    commentCount?: number;
    posterImage?: string;

    constructor(
        id: string,
        username: string,
        title: string,
        imageUrls: string,
        description: string,
        createdAt: number,
        likeCount?: number,
        isLikedByCurrentUser?: boolean,
        commentCount?: number,
        posterImage?: string
    ) {
        this._id = id
        this.userId = {username}
        this.title = title;
        this.imageUrls = imageUrls;
        this.description = description;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.isLikedByCurrentUser = isLikedByCurrentUser;
        this.commentCount = commentCount;
        this.posterImage = posterImage;
    }
}

export default PostProp;