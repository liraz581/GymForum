import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
}

// Define the Like schema
const LikeSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
        required: true
    }
});

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);