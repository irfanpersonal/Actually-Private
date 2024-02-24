import mongoose from 'mongoose';

export interface IFollowRequest extends mongoose.Document {
    from: mongoose.Schema.Types.ObjectId,
    to: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const followRequestSchema = new mongoose.Schema<IFollowRequest>({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Must Provide Follow Request From'],
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Must Provide Follow Request To'],
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model<IFollowRequest>('FollowRequest', followRequestSchema);