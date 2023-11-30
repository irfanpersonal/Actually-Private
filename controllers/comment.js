const {StatusCodes} = require('http-status-codes');
const Post = require('../models/Post.js');
const Comment = require('../models/Comment.js');
const CustomError = require('../errors');

const createComment = async(req, res) => {
    const {postID} = req.params;
    const post = await Post.findOne({_id: postID});
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    req.body.user = req.user.userID;
    req.body.post = postID;
    const comment = await Comment.create(req.body);
    await comment.populate('user');
    await Post.findOneAndUpdate({_id: postID}, {$addToSet: {comments: comment._id}});
    return res.status(StatusCodes.CREATED).json({comment});
}

const getNestedComments = async(req, res) => {
    const {postID, parentCommentID} = req.params;
    const comment = await Comment.findOne({_id: parentCommentID, post: postID}).populate('comments');
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID and Post ID Provided!');
    }
    const nestedComments = comment.comments;
    return res.status(StatusCodes.OK).json({comments: nestedComments});
}

const createNestedComment = async(req, res) => {
    const {postID, parentCommentID} = req.params;
    const post = await Post.findOne({_id: postID});
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    const comment = await Comment.findOne({_id: parentCommentID});
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    req.body.post = postID;
    req.body.parentComment = parentCommentID;
    req.body.user = req.user.userID;
    const updatedComment = await Comment.create(req.body);
    await Comment.findOneAndUpdate({_id: parentCommentID}, {$addToSet: {comments: updatedComment._id}});
    return res.status(StatusCodes.CREATED).json({comment: updatedComment});
}

const likeComment = async(req, res) => {
    const {commentID} = req.params;
    const comment = await Comment.findOne({_id: commentID});
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    if (comment.likes.includes(req.user.userID)) {
        throw new CustomError.BadRequestError('You have already liked this comment!');
    }
    await Comment.findOneAndUpdate({_id: commentID}, {$addToSet: {likes: req.user.userID}});
    return res.status(StatusCodes.CREATED).json({commentID: comment._id, userID: req.user.userID});
}

const unlikeComment = async(req, res) => {
    const {commentID} = req.params;
    const comment = await Comment.findOne({_id: commentID});
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    if (!comment.likes.includes(req.user.userID)) {
        throw new CustomError.BadRequestError(`You can't unlike something you never liked!`);
    }
    await Comment.findOneAndUpdate({_id: commentID}, {$pull: {likes: req.user.userID}});
    return res.status(StatusCodes.CREATED).json({commentID: comment._id, userID: req.user.userID});
}

const getSingleComment = async(req, res) => {
    const {id} = req.params;
    const comment = await Comment.findOne({_id: id});
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({comment});
}

const updateSingleComment = async(req, res) => {
    const {id} = req.params;
    const {content} = req.body;
    const comment = await Comment.findOne({_id: id});
    if (comment.user.toString() !== req.user.userID) {
        throw new CustomError.UnauthorizedError('You cannot update someone elses comment!');
    }
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    if (content) {
        comment.content = content;
    }
    await comment.save();
    return res.status(StatusCodes.OK).json({comment});
}

const deleteSingleComment = async(req, res) => {
    const {id} = req.params;
    const comment = await Comment.findOne({_id: id});
    if (comment.user.toString() !== req.user.userID) {
        throw new CustomError.UnauthorizedError('You cannot delete someone elses comment!');
    }
    if (!comment) {
        throw new CustomError.NotFoundError('No Comment Found with the ID Provided!');
    }
    if (comment.comments && comment.comments.length) {
        await Comment.deleteMany({_id: {$in: comment.comments}});
        comment.comments = [];
    }
    if (comment.parentComment) {
        await Comment.findOneAndUpdate({_id: comment.parentComment}, {$pull: {comments: id}});
    }
    const commentID = comment._id;
    await comment.deleteOne();
    await Post.findOneAndUpdate({_id: comment.post}, {$pull: {comments: comment._id}});
    return res.status(StatusCodes.OK).json({commentID});
}

const getSinglePostComments = async(req, res) => {
    const {id} = req.params;
    const comments = await Comment.find({post: id, parentComment: {$exists: false}}).populate('user');
    return res.status(StatusCodes.OK).json({comments});
}

module.exports = {
    createComment,
    getNestedComments,
    createNestedComment,
    likeComment,
    unlikeComment,
    getSingleComment,
    updateSingleComment,
    deleteSingleComment,
    getSinglePostComments
};