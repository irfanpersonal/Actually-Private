import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {User, Comment, FollowRequest, Post} from '../models';

const getStats = async(req: Request, res: Response) => {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();
    const followRequestCount = await FollowRequest.countDocuments();
    const mostFollowedUsers = await User.aggregate([
        { $project: { name: 1, 'Follow Count': { $size: '$followers' } } },
        { $sort: { 'Follow Count': -1 } },
        { $limit: 5 }
    ]);
    const mostLikedPosts = await Post.aggregate([
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
    return res.status(StatusCodes.OK).json({statsData});
}

export {
    getStats
};