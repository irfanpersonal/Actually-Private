import {Request, Response} from 'express';
import {IComment} from '../models/Comment';
import {StatusCodes} from 'http-status-codes';
import {ITokenPayload} from '../utils';
import {IUser} from '../models/User';
import {Post, Comment, User} from '../models';
import CustomError from '../errors';
import mongoose from 'mongoose';

interface CommentRequest extends Request {
    params: {
        id: string,
        commentID: string
    },
    body: IComment,
    query: {
        page: string,
        limit: string
    },
    user?: ITokenPayload
}

const createSingleComment = async(req: CommentRequest, res: Response) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id});
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    // Check if you blocked the user
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new CustomError.BadRequestError('You cannot comment on a post of someone you blocked!');
    }
    // Check if the user blocked you 
    const postUser = (await User.findOne({_id: post.user}))!;
    if (postUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You cannot comment on a post of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new CustomError.BadRequestError(`You cannot comment on the post of someone you don't follow and they have their visibility set to private!`)
    }
    req.body.post = id as unknown as mongoose.Schema.Types.ObjectId;
    req.body.user = req.user!.userID as unknown as mongoose.Schema.Types.ObjectId;
    const comment = await Comment.create(req.body);
    // Once the comment is created push the id of the comment into the post and save
    post.comments.push(comment._id as any);
    await post.save();
    return res.status(StatusCodes.OK).json({msg: 'Created Comment!', comment});
}

const getSingleComment = async(req: CommentRequest, res: Response) => {
    const {commentID} = req.params;
    const comment = await Comment.findOne({_id: commentID});
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({comment});
}

const updateSingleComment = async(req: CommentRequest, res: Response) => {
    const {commentID} = req.params;
    const comment = await Comment.findOne({_id: commentID});
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the user
    const post = (await Post.findOne({_id: comment.post}))!;
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    const postUser = (await User.findOne({_id: post.user}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new CustomError.BadRequestError('You cannot update a comment on a post of someone you blocked!');
    }
    // Check if the user blocked you
    if (postUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You cannot update comment on a post of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new CustomError.BadRequestError(`You cannot update comment on the post of someone you don't follow and they have their visibility set to private!`)
    }
    // Throw an error if its not your comment to update
    if (comment.user.toString() !== req.user!.userID) {
        throw new CustomError.UnauthorizedError('You cannot update someone elses comment!');
    }
    const {content} = req.body;
    if (content) {
        comment.content = content;
    }
    await comment.save();
    return res.status(StatusCodes.OK).json({comment});
}

const deleteSingleComment = async(req: CommentRequest, res: Response) => {
    const {commentID} = req.params;
    const comment = await Comment.findOne({_id: commentID});
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the user
    const post = (await Post.findOne({_id: comment.post}))!;
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    const postUser = (await User.findOne({_id: post.user}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new CustomError.BadRequestError('You cannot delete a comment on a post of someone you blocked!');
    }
    // Check if the user blocked you
    if (postUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You cannot delete a comment on a post of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new CustomError.BadRequestError(`You cannot delete a comment on the post of someone you don't follow and they have their visibility set to private!`)
    }
    // Throw an error if its not your comment to update
    if (comment.user.toString() !== req.user!.userID) {
        throw new CustomError.UnauthorizedError('You cannot delete someone elses comment!');
    }
    // Remove the Comment from Post Comments Array and Save
    post.comments = post.comments.filter((item: any) => item != commentID);
    await post.save();
    // Delete the Comment
    await comment.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Single Comment!'});
}

const likeComment = async(req: CommentRequest, res: Response) => {
    const {commentID} = req.params;
    const comment = await Comment.findById(commentID);
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the post user
    const post = (await Post.findOne({_id: comment.post}))!;
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    const postUser = (await User.findOne({_id: post.user}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new CustomError.BadRequestError('You cannot unlike a comment on a post of someone you blocked!');
    }
    // Check if the post user blocked you
    if (postUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You cannot unlike a comment on a post of someone that blocked you!');
    }
    // Check if the comment is from a post you created
    if (post.user.toString() === req.user!.userID) {
        // Check if the comment user is someone you blocked
        if (loggedInUser.blockedUsers.includes(comment.user)) {
            throw new CustomError.BadRequestError('You cannot like the comment of someone you blocked!');
        }
        // Check if the comment user is someone that blocked you
        const commentUser = (await User.findById(comment.user))!;
        if (commentUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
            throw new CustomError.BadRequestError('You cannot like the comment of someone that blocked you!');
        }
        // Check if you already liked the comment
        if (comment.likes.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
            throw new CustomError.BadRequestError('You have already liked this comment!');
        }
        // Like the Comment
        comment.likes.push(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId);
        await comment.save();
        return res.status(StatusCodes.OK).json({msg: 'Liked Comment'});
    }
    else {
        if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
            throw new CustomError.BadRequestError(`You cannot unlike a comment on the post of someone you don't follow and they have their visibility set to private!`)
        }
        // Check if you already like it
        if (comment.likes.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
            throw new CustomError.BadRequestError('You have already liked this comment!');
        }
        comment.likes.push(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId);
        await comment.save();
        return res.status(StatusCodes.OK).json({msg: 'Liked Comment'});
    }
}

const unlikeComment = async(req: CommentRequest, res: Response) => {
    const {commentID} = req.params;
    const comment = await Comment.findById(commentID);
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the post user
    const post = (await Post.findOne({_id: comment.post}))!;
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    const postUser = (await User.findOne({_id: post.user}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new CustomError.BadRequestError('You cannot unlike a comment on a post of someone you blocked!');
    }
    // Check if the post user blocked you
    if (postUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You cannot unlike a comment on a post of someone that blocked you!');
    }
    // Check if the comment is from a post you created
    if (post.user.toString() === req.user!.userID) {
        // Check if the comment user is someone you blocked
        if (loggedInUser.blockedUsers.includes(comment.user)) {
            throw new CustomError.BadRequestError('You cannot unlike the comment of someone you blocked!');
        }
        // Check if the comment user is someone that blocked you
        const commentUser = (await User.findById(comment.user))!;
        if (commentUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
            throw new CustomError.BadRequestError('You cannot unlike the comment of someone that blocked you!');
        }
        // Check if you even liked the comment
        if (!comment.likes.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
            throw new CustomError.BadRequestError(`You can't unlike something you never liked!`);
        }
        // Unlike the Comment
        comment.likes = comment.likes.filter((item: any) => item != req.user!.userID);
        await comment.save();
        return res.status(StatusCodes.OK).json({msg: 'Unliked Comment'});
    }
    else {
        if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
            throw new CustomError.BadRequestError(`You cannot unlike a comment on the post of someone you don't follow and they have their visibility set to private!`)
        }
        // Check if you even like it
        if (!comment.likes.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
            throw new CustomError.BadRequestError(`You can't unlike something you never liked!`);
        }
        comment.likes = comment.likes.filter((item: any) => item != req.user!.userID);
        await comment.save();
        return res.status(StatusCodes.OK).json({msg: 'Unliked Comment'});
    }
}

export {
    createSingleComment,
    getSingleComment,
    updateSingleComment,
    deleteSingleComment,
    likeComment,
    unlikeComment
};