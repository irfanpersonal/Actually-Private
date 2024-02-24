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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeComment = exports.likeComment = exports.deleteSingleComment = exports.updateSingleComment = exports.getSingleComment = exports.createSingleComment = void 0;
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
const errors_1 = __importDefault(require("../errors"));
const createSingleComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield models_1.Post.findOne({ _id: id });
    if (!post) {
        throw new errors_1.default.NotFoundError('No Post Found with the ID Provided!');
    }
    // Check if you blocked the user
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new errors_1.default.BadRequestError('You cannot comment on a post of someone you blocked!');
    }
    // Check if the user blocked you 
    const postUser = (yield models_1.User.findOne({ _id: post.user }));
    if (postUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot comment on a post of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new errors_1.default.BadRequestError(`You cannot comment on the post of someone you don't follow and they have their visibility set to private!`);
    }
    req.body.post = id;
    req.body.user = req.user.userID;
    const comment = yield models_1.Comment.create(req.body);
    // Once the comment is created push the id of the comment into the post and save
    post.comments.push(comment._id);
    yield post.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Created Comment!', comment });
});
exports.createSingleComment = createSingleComment;
const getSingleComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentID } = req.params;
    const comment = yield models_1.Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new errors_1.default.NotFoundError('No Comment Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ comment });
});
exports.getSingleComment = getSingleComment;
const updateSingleComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentID } = req.params;
    const comment = yield models_1.Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new errors_1.default.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the user
    const post = (yield models_1.Post.findOne({ _id: comment.post }));
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    const postUser = (yield models_1.User.findOne({ _id: post.user }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new errors_1.default.BadRequestError('You cannot update a comment on a post of someone you blocked!');
    }
    // Check if the user blocked you
    if (postUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot update comment on a post of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new errors_1.default.BadRequestError(`You cannot update comment on the post of someone you don't follow and they have their visibility set to private!`);
    }
    // Throw an error if its not your comment to update
    if (comment.user.toString() !== req.user.userID) {
        throw new errors_1.default.UnauthorizedError('You cannot update someone elses comment!');
    }
    const { content } = req.body;
    if (content) {
        comment.content = content;
    }
    yield comment.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ comment });
});
exports.updateSingleComment = updateSingleComment;
const deleteSingleComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentID } = req.params;
    const comment = yield models_1.Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new errors_1.default.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the user
    const post = (yield models_1.Post.findOne({ _id: comment.post }));
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    const postUser = (yield models_1.User.findOne({ _id: post.user }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new errors_1.default.BadRequestError('You cannot delete a comment on a post of someone you blocked!');
    }
    // Check if the user blocked you
    if (postUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot delete a comment on a post of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new errors_1.default.BadRequestError(`You cannot delete a comment on the post of someone you don't follow and they have their visibility set to private!`);
    }
    // Throw an error if its not your comment to update
    if (comment.user.toString() !== req.user.userID) {
        throw new errors_1.default.UnauthorizedError('You cannot delete someone elses comment!');
    }
    // Remove the Comment from Post Comments Array and Save
    post.comments = post.comments.filter((item) => item != commentID);
    yield post.save();
    // Delete the Comment
    yield comment.deleteOne();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Single Comment!' });
});
exports.deleteSingleComment = deleteSingleComment;
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentID } = req.params;
    const comment = yield models_1.Comment.findById(commentID);
    if (!comment) {
        throw new errors_1.default.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the post user
    const post = (yield models_1.Post.findOne({ _id: comment.post }));
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    const postUser = (yield models_1.User.findOne({ _id: post.user }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new errors_1.default.BadRequestError('You cannot unlike a comment on a post of someone you blocked!');
    }
    // Check if the post user blocked you
    if (postUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot unlike a comment on a post of someone that blocked you!');
    }
    // Check if the comment is from a post you created
    if (post.user.toString() === req.user.userID) {
        // Check if the comment user is someone you blocked
        if (loggedInUser.blockedUsers.includes(comment.user)) {
            throw new errors_1.default.BadRequestError('You cannot like the comment of someone you blocked!');
        }
        // Check if the comment user is someone that blocked you
        const commentUser = (yield models_1.User.findById(comment.user));
        if (commentUser.blockedUsers.includes(req.user.userID)) {
            throw new errors_1.default.BadRequestError('You cannot like the comment of someone that blocked you!');
        }
        // Check if you already liked the comment
        if (comment.likes.includes(req.user.userID)) {
            throw new errors_1.default.BadRequestError('You have already liked this comment!');
        }
        // Like the Comment
        comment.likes.push(req.user.userID);
        yield comment.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Liked Comment' });
    }
    else {
        if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
            throw new errors_1.default.BadRequestError(`You cannot unlike a comment on the post of someone you don't follow and they have their visibility set to private!`);
        }
        // Check if you already like it
        if (comment.likes.includes(req.user.userID)) {
            throw new errors_1.default.BadRequestError('You have already liked this comment!');
        }
        comment.likes.push(req.user.userID);
        yield comment.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Liked Comment' });
    }
});
exports.likeComment = likeComment;
const unlikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentID } = req.params;
    const comment = yield models_1.Comment.findById(commentID);
    if (!comment) {
        throw new errors_1.default.NotFoundError('No Comment Found with the ID Provided!');
    }
    // Check if you blocked the post user
    const post = (yield models_1.Post.findOne({ _id: comment.post }));
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    const postUser = (yield models_1.User.findOne({ _id: post.user }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new errors_1.default.BadRequestError('You cannot unlike a comment on a post of someone you blocked!');
    }
    // Check if the post user blocked you
    if (postUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot unlike a comment on a post of someone that blocked you!');
    }
    // Check if the comment is from a post you created
    if (post.user.toString() === req.user.userID) {
        // Check if the comment user is someone you blocked
        if (loggedInUser.blockedUsers.includes(comment.user)) {
            throw new errors_1.default.BadRequestError('You cannot unlike the comment of someone you blocked!');
        }
        // Check if the comment user is someone that blocked you
        const commentUser = (yield models_1.User.findById(comment.user));
        if (commentUser.blockedUsers.includes(req.user.userID)) {
            throw new errors_1.default.BadRequestError('You cannot unlike the comment of someone that blocked you!');
        }
        // Check if you even liked the comment
        if (!comment.likes.includes(req.user.userID)) {
            throw new errors_1.default.BadRequestError(`You can't unlike something you never liked!`);
        }
        // Unlike the Comment
        comment.likes = comment.likes.filter((item) => item != req.user.userID);
        yield comment.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Unliked Comment' });
    }
    else {
        if (postUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
            throw new errors_1.default.BadRequestError(`You cannot unlike a comment on the post of someone you don't follow and they have their visibility set to private!`);
        }
        // Check if you even like it
        if (!comment.likes.includes(req.user.userID)) {
            throw new errors_1.default.BadRequestError(`You can't unlike something you never liked!`);
        }
        comment.likes = comment.likes.filter((item) => item != req.user.userID);
        yield comment.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Unliked Comment' });
    }
});
exports.unlikeComment = unlikeComment;
