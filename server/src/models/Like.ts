import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
}

const LikeSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);