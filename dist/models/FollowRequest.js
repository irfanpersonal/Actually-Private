"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const followRequestSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Must Provide Follow Request From'],
        ref: 'User'
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Must Provide Follow Request To'],
        ref: 'User'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('FollowRequest', followRequestSchema);
