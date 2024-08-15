import mongoose from 'mongoose';

export interface IPost {
    type: 'content' | 'image' | 'video' | 'audio' | 'file',
    attachmentUrl: string,
    content: string,
    location: string,
    user: mongoose.Schema.Types.ObjectId,
    likes: mongoose.Schema.Types.ObjectId[],
    comments: mongoose.Schema.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}

const postSchema = new mongoose.Schema<IPost>({
    type: {
        type: String,
        required: [true, 'Must Provide Post Type'],
        enum: {
            values: ['content', 'image', 'video', 'audio', 'file'],
            message: '{VALUE} is not supported'
        }
    },
    attachmentUrl: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: [true, 'Must Provide Post Content']
    },
    location: {
        type: String,
        default: ''
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