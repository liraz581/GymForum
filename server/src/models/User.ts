import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    refreshToken?: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: false },
    refreshToken: {
        type: String,
        default: null,
        required: false,
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);