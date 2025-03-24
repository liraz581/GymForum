class CommentProp {
    id: string;
    username: string;
    text: string;
    timestamp: number;
    imageUrl: string;

    constructor(id: string, userId: string, text: string, timestamp: number, imageUrl: string) {
        this.id = id;
        this.username = userId;
        this.text = text;
        this.timestamp = timestamp;
        this.imageUrl = imageUrl
    }
}

export default CommentProp;