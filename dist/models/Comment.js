"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Comment User'],
        ref: 'User'
    },
    post: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Comment Post'],
        ref: 'Post'
    },
    content: {
        type: String,
        required: [true, 'Must Provide Comment Content']
    },
    likes: {
        type: [mongoose_1.default.SchemaTypes.ObjectId],
        ref: 'User'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Comment', commentSchema);
