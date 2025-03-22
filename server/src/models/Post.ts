import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    imageUrls?: string[];
    createdAt: Date;
}

const PostSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrls: [{
        type: String
    }]
}, {
    timestamps: true
});

export default mongoose.model<IPost>('Post', PostSchema);