"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userCount = yield models_1.User.countDocuments();
    const postCount = yield models_1.Post.countDocuments();
    const commentCount = yield models_1.Comment.countDocuments();
    const followRequestCount = yield models_1.FollowRequest.countDocuments();
    const mostFollowedUsers = yield models_1.User.aggregate([
        { $project: { name: 1, 'Follow Count': { $size: '$followers' } } },
        { $sort: { 'Follow Count': -1 } },
        { $limit: 5 }
    ]);
    const mostLikedPosts = yield models_1.Post.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $project: {
                user: { $arrayElemAt: ['$userDetails.name', 0] },
                _id: 1,
                likeCount: { $size: '$likes' }
            }
        },
        { $sort: { likeCount: -1 } },
        { $limit: 5 }
    ]);
    const statsData = {
        userCount,
        postCount,
        commentCount,
        followRequestCount,
        mostFollowedUsers,
        mostLikedPosts
    };
    return res.status(http_status_codes_1.StatusCodes.OK).json({ statsData });
});
exports.getStats = getStats;
