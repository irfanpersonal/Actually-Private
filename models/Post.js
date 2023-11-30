const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Must Provide Post Image']
    },
    content: {
        type: String,
        required: [true, 'Must Provide Post Content']
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Post User'],
        ref: 'User'
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

postSchema.post('deleteOne', {document: true, query: false}, async function() {
    if (this.comments && this.comments.length > 0) {
        await this.model('Comment').deleteMany({_id: {$in: this.comments}});
    }
    await this.model('Comment').deleteMany({post: this._id});
});

module.exports = mongoose.model('Post', postSchema);