"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Must Provide Follow Request From']
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Must Provide Follow Request To']
    },
    reason: {
        type: String,
        required: [true, 'Must Provide Report Reason']
    },
    image: {
        type: String,
        default: ''
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Report', reportSchema);
