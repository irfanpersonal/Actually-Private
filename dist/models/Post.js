"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Must Provide Post User'],
        ref: 'User'
    },
    likes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User'
    },
    comments: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Comment'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Post', postSchema);
