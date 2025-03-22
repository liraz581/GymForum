class CommentProp {
    id: string;
    username: string;
    text: string;
    timestamp: number;

    constructor(id: string, userId: string, text: string, timestamp: number) {
        this.id = id;
        this.username = userId;
        this.text = text;
        this.timestamp = timestamp;
    }
}

export default CommentProp;