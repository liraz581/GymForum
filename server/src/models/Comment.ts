import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    text: string;
    timestamp: number;
}

const CommentSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Number,
        required: false,
    }
});

CommentSchema.index({ postId: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);