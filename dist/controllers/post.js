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
exports.globalSearch = exports.getTrendingTopics = exports.getSingleUserPosts = exports.unlikePost = exports.likePost = exports.getUsersPosts = exports.deleteSinglePost = exports.getSinglePostComments = exports.getSinglePost = exports.createPost = exports.getUserFeed = void 0;
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
const errors_1 = __importDefault(require("../errors"));
const utils_1 = require("../utils");
const node_path_1 = __importDefault(require("node:path"));
const cloudinary_1 = require("cloudinary");
const stopword_1 = require("stopword");
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    // If you follow no one you'll just get all posts on your feed
    if (!loggedInUser.following.length) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const aggregationPipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: { 'user.visibility': { $ne: 'private' } }
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    attachmentUrl: 1,
                    location: 1,
                    user: {
                        _id: 1,
                        name: 1,
                        nickName: 1,
                        email: 1,
                        location: 1,
                        profilePicture: 1
                    },
                    likes: 1,
                    comments: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ];
        const posts = yield models_1.Post.aggregate([...aggregationPipeline, { $skip: skip }, { $limit: limit }]);
        const processedPosts = posts.map(post => {
            const likesConvertedToString = post.likes.map((objectId) => objectId.toString());
            return Object.assign(Object.assign({}, post), { liked: likesConvertedToString.includes(req.user.userID) });
        });
        const totalPosts = (yield models_1.Post.aggregate(aggregationPipeline)).length;
        const numberOfPages = Math.ceil(totalPosts / limit);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ posts: processedPosts, totalPosts, numberOfPages });
    }
    // If you follow someone youll see all of their posts
    const followingIds = loggedInUser.following.map(user => user.toString());
    let result = models_1.Post.find({ user: { $in: followingIds } }).populate({
        path: 'user'
    });
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const posts = yield result;
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map((objectId) => objectId.toString());
        return Object.assign(Object.assign({}, post), { liked: likesConvertedToString.includes(req.user.userID) });
    });
    const totalPosts = yield models_1.Post.countDocuments({ user: { $in: followingIds } });
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ posts: processedPosts, totalPosts, numberOfPages });
});
exports.getUserFeed = getUserFeed;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content } = req.body;
    if (!content) {
        throw new errors_1.default.BadRequestError('Please provide content for post!');
    }
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.attachment) {
        // If attachment provided that means it is a Image, Video, or Audio Post
        const attachment = req.files.attachment;
        if (attachment.mimetype.startsWith('image')) {
            req.body.type = 'image';
        }
        else if (attachment.mimetype.startsWith('video')) {
            req.body.type = 'video';
        }
        else if (attachment.mimetype.startsWith('audio')) {
            req.body.type = 'audio';
        }
        else {
            req.body.type = 'file';
        }
        const size = 1000000 * 2;
        if (attachment.size > size) {
            throw new errors_1.default.BadRequestError('File Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'post' + '_' + attachment.name;
        const destination = node_path_1.default.resolve(__dirname, '../files', uniqueIdentifier);
        yield attachment.mv(destination);
        const result = yield cloudinary_1.v2.uploader.upload(destination, {
            public_id: uniqueIdentifier,
            folder: 'ACTUALLY-PRIVATE/POST_MEDIA',
            resource_type: 'auto'
        });
        yield (0, utils_1.deleteFile)(destination);
        req.body.attachmentUrl = result.secure_url;
        req.body.user = req.user.userID;
    }
    else {
        // If no attachment provided that means this is a Content Post
        req.body.type = 'content';
        req.body.user = req.user.userID;
    }
    const createdPost = yield models_1.Post.create(req.body);
    const post = yield models_1.Post.findById(createdPost._id).populate({
        path: 'user',
        select: '-password'
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ post });
});
exports.createPost = createPost;
const getSinglePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield models_1.Post.findOne({ _id: id }).populate('user');
    if (!post) {
        throw new errors_1.default.NotFoundError('No Post Found with the ID Provided!');
    }
    const likesConvertedToString = post.likes.map(objectId => objectId.toString());
    // If your the owner of the post you can view it
    if (post.user._id.toString() === req.user.userID) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ post, yourPost: true, liked: likesConvertedToString.includes(req.user.userID) });
    }
    // Check if the posts user blocked you
    if (post.user.blockedUsers.includes(req.user.userID)) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: `${post.user.name} has blocked you.`, redirectHome: true });
    }
    // Check if you blocked them
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'You have blocked this user', redirectHome: true });
    }
    // Check if the posts user is private and if you don't follow
    const loggedInUsersFollowingArray = loggedInUser.following.map(user => user.toString());
    if (post.user.visibility === 'private' && !loggedInUsersFollowingArray.includes(post.user._id.toString())) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'The posts user is private and you dont follow them so you cannot see their post!', redirectHome: true });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ post, liked: likesConvertedToString.includes(req.user.userID) });
});
exports.getSinglePost = getSinglePost;
const getSinglePostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let result = models_1.Comment.find({ post: id }).populate('user');
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const comments = yield result;
    const processedComments = comments.map(comment => {
        const likesConvertedToString = comment.likes.map(objectId => objectId.toString());
        return Object.assign(Object.assign({}, comment), { liked: likesConvertedToString.includes(req.user.userID), myComment: (comment.user._id).toString() === req.user.userID });
    });
    const totalComments = yield models_1.Comment.countDocuments({ post: id });
    const numberOfPages = Math.ceil(totalComments / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ comments: processedComments, totalComments, numberOfPages });
});
exports.getSinglePostComments = getSinglePostComments;
const deleteSinglePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield models_1.Post.findOne({ _id: id, user: req.user.userID });
    if (!post) {
        throw new errors_1.default.NotFoundError('No Post Found with the ID Provided!');
    }
    // Delete All Comments
    post.comments.forEach((comment) => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.Comment.deleteOne({ _id: comment });
    }));
    // Check if Post has an Image and if it does delete it
    if (post.attachmentUrl) {
        const oldImage = post.attachmentUrl.substring(post.attachmentUrl.indexOf('ACTUALLY'));
        yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
    }
    yield post.deleteOne();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Post!' });
});
exports.deleteSinglePost = deleteSinglePost;
const getUsersPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = models_1.Post.find({ user: req.user.userID }).populate('user').select('-password');
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const posts = yield result;
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map(objectId => objectId.toString());
        return Object.assign(Object.assign({}, post), { liked: likesConvertedToString.includes(req.user.userID) });
    });
    const totalPosts = yield models_1.Post.countDocuments({ user: req.user.userID });
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ posts: processedPosts, totalPosts, numberOfPages });
});
exports.getUsersPosts = getUsersPosts;
// The reason why I chose to keep comment/like data is so it doesn't lead to 
// inconsistency. If a user blocks another user the interactions they had should 
// still remain. Because for others it would look confusing.
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = (yield models_1.Post.findOne({ _id: id }));
    // If its your post you can like it
    if (post.user._id.toString() === req.user.userID) {
        yield models_1.Post.findOneAndUpdate({ _id: id }, { $addToSet: { likes: req.user.userID } });
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: 'Liked Post!' });
    }
    // Check if post exists
    if (!post) {
        throw new errors_1.default.NotFoundError('No Post Found with the ID Provided!');
    }
    // Check if you blocked them
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new errors_1.default.BadRequestError('You cannot like the post of a person you blocked!');
    }
    // Check if this user blocked you
    const postsUser = (yield models_1.User.findOne({ _id: post.user }));
    if (postsUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot like the post of a person that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postsUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new errors_1.default.BadRequestError(`You cannot like the post of someone you don't follow and they have their visibility set to private!`);
    }
    // Check if you already liked the post
    if (post.likes.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You have already liked this post!');
    }
    yield models_1.Post.findOneAndUpdate({ _id: id }, { $addToSet: { likes: req.user.userID } });
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: 'Liked Post!' });
});
exports.likePost = likePost;
const unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = (yield models_1.Post.findOne({ _id: id }));
    // Check if post exists
    if (!post) {
        throw new errors_1.default.NotFoundError('No Post Found with the ID Provided!');
    }
    // If its your post you can unlike it
    if (post.user._id.toString() === req.user.userID) {
        yield models_1.Post.findOneAndUpdate({ _id: id }, { $pull: { likes: req.user.userID } });
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: 'Unliked Post!' });
    }
    // Check if you blocked them
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new errors_1.default.BadRequestError('You cannot unlike the post of a person you blocked!');
    }
    // Check if this user blocked you
    const postsUser = (yield models_1.User.findOne({ _id: post.user }));
    if (postsUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot unlike the post of a person that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postsUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new errors_1.default.BadRequestError(`You cannot unlike the post of someone you don't follow and they have their visibility set to private!`);
    }
    // Check if you you even liked this post, and if you didn't throw an error
    if (!post.likes.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError(`You can't unlike something you never liked!`);
    }
    yield models_1.Post.findOneAndUpdate({ _id: id }, { $pull: { likes: req.user.userID } });
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: 'Unliked Post!' });
});
exports.unlikePost = unlikePost;
const getSingleUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userID } = req.params;
    const postsUser = (yield models_1.User.findById(userID));
    const loggedInUser = (yield models_1.User.findById(req.user.userID));
    if (!postsUser) {
        throw new errors_1.default.NotFoundError('No User Posts Found with the ID Provided!');
    }
    // Check if you blocked this user
    if (loggedInUser.blockedUsers.includes(postsUser._id)) {
        throw new errors_1.default.BadRequestError('You have blocked this user');
    }
    // Check if the postsUser blocked you
    if (postsUser.blockedUsers.includes(loggedInUser._id)) {
        throw new errors_1.default.BadRequestError('You cannot view the posts of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow
    if (postsUser.visibility === 'private' && !loggedInUser.following.includes(postsUser._id)) {
        throw new errors_1.default.BadRequestError('The user is private and you dont follow them so you cannot see their posts!');
    }
    // Return Posts 
    let result = models_1.Post.find({ user: userID }).populate('user').select('-password');
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const posts = yield result;
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map(objectId => objectId.toString());
        return Object.assign(Object.assign({}, post), { liked: likesConvertedToString.includes(req.user.userID) });
    });
    const totalPosts = yield models_1.Post.countDocuments({ user: userID });
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ posts: processedPosts, totalPosts, numberOfPages });
});
exports.getSingleUserPosts = getSingleUserPosts;
const getTrendingTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield models_1.Post.find();
    const wordCount = {};
    posts.forEach(post => {
        // Using the "stopword" third party module I have excluded some common words from
        // my search and used regex to remove all numbers. So only keywords.
        const words = post.content.toLowerCase().match(/\b[a-z]+\b/g) || [];
        const filteredWords = (0, stopword_1.removeStopwords)(words);
        filteredWords.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
    });
    const sortedWords = Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]);
    const top10Words = sortedWords.slice(0, 10);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ trending: top10Words });
});
exports.getTrendingTopics = getTrendingTopics;
const globalSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const matchStage = {};
    if (search) {
        matchStage.content = { $regex: search, $options: 'i' };
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const aggregationPipeline = [
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $match: { 'user.visibility': { $ne: 'private' } }
        },
        {
            $project: {
                _id: 1,
                type: 1,
                content: 1,
                attachmentUrl: 1,
                location: 1,
                user: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    location: 1,
                    profilePicture: 1
                },
                likes: 1,
                comments: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
    const posts = yield models_1.Post.aggregate([...aggregationPipeline, { $skip: skip }, { $limit: limit }]);
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map((objectId) => objectId.toString());
        return Object.assign(Object.assign({}, post), { liked: likesConvertedToString.includes(req.user.userID) });
    });
    const totalPosts = (yield models_1.Post.aggregate(aggregationPipeline)).length;
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ posts: processedPosts, totalPosts, numberOfPages });
});
exports.globalSearch = globalSearch;
