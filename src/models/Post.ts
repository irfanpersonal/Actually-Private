import mongoose from 'mongoose';

export interface IPost {
    location: string,
    image: string,
    content: string,
    user: mongoose.Schema.Types.ObjectId,
    likes: mongoose.Schema.Types.ObjectId[],
    comments: mongoose.Schema.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}

const postSchema = new mongoose.Schema<IPost>({
    location: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: [true, 'Must Provide Post Image']
    },
    content: {
        type: String,
        required: [true, 'Must Provide Post Content']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Must Provide Post User'],
        ref: 'User'
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment'
    }
}, {timestamps: true});

export default mongoose.model<IPost>('Post', postSchema);