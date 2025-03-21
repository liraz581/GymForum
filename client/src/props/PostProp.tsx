class PostProp {
    username: string;
    title: string;
    imageUrl: string;
    description: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;

    constructor(
        username: string,
        title: string,
        imageUrl: string,
        description: string,
        createdAt: string,
        likeCount: number,
        commentCount: number,
    ) {
        this.username = username;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
    }
}

export default PostProp;