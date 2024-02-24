import mongoose from 'mongoose';

export interface IComment {
    user: mongoose.Schema.Types.ObjectId,
    post: mongoose.Schema.Types.ObjectId,
    content: string,
    likes: mongoose.Schema.Types.ObjectId[]
}

const commentSchema = new mongoose.Schema<IComment>({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Comment User'],
        ref: 'User'
    },
    post: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Comment Post'],
        ref: 'Post'
    },
    content: {
        type: String,
        required: [true, 'Must Provide Comment Content']
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model<IComment>('Comment', commentSchema);