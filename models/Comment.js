const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    parentComment: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment'
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'User'
    },
    comments: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'Comment'
    }
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);