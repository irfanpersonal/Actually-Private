const {StatusCodes} = require('http-status-codes');
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const CustomError = require('../errors');
const path = require('node:path');
const fs = require('node:fs');

const getAllPosts = async(req, res) => {
    const posts = await Post.find().populate('user');
    return res.status(StatusCodes.OK).json(posts);
}

const userFeed = async(req, res) => {
    const followingArray = await User.findOne({_id: req.user.userID}).select('following');
    const followingIds = followingArray.following.map(user => user.toString());
    const posts = await Post.find({user: {$in: followingIds}}).populate('user');
    return res.status(StatusCodes.OK).json({posts});
}

const getCurrentUserPosts = async(req, res) => {
    const posts = await Post.find({user: req.user.userID}).populate('user');
    return res.status(StatusCodes.OK).json({posts, count: posts.length});
}

const getPostsFromUser = async(req, res) => {
    const {id} = req.params;
    const posts = await Post.find({user: id}).populate('user');
    return res.status(StatusCodes.OK).json({posts, count: posts.length});
}

const createPost = async(req, res) => {
    const {content} = req.body;
    if (!content || !req?.files?.image) {
        throw new CustomError.BadRequestError('Please check inputs!');
    }
    const image = req.files.image;
    const uniqueIdentifier = new Date().getTime() + '_' + image.name;
    const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
    await image.mv(destination);
    req.body.image = `/${uniqueIdentifier}`;
    req.body.user = req.user.userID;
    const post = await Post.create(req.body);
    return res.status(StatusCodes.CREATED).json({post});
}

const likePost = async(req, res) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id});
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    if (post.likes.includes(req.user.userID)) {
        throw new CustomError.BadRequestError('You have already liked this post!');
    }
    await Post.findOneAndUpdate({_id: id}, {$addToSet: {likes: req.user.userID}});
    return res.status(StatusCodes.CREATED).json({postID: post._id, userID: req.user.userID});
}

const unlikePost = async(req, res) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id});
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    if (!post.likes.includes(req.user.userID)) {
        throw new CustomError.BadRequestError(`You can't unlike something you never liked!`);
    }
    await Post.findOneAndUpdate({_id: id}, {$pull: {likes: req.user.userID}});
    return res.status(StatusCodes.CREATED).json({postID: post._id, userID: req.user.userID});
}

const getSinglePost = async(req, res) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id}).populate('user');
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({post});
}

const updateSinglePost = async(req, res) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id});
    if (post.user.toString() !== req.user.userID) {
        throw new CustomError.UnauthorizedError('You cannot update someone elses post!');
    }
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    const {content} = req.body;
    if (content) {
        post.content = content;
    }
    if (req?.files?.image) {
        await fs.unlink(path.join(__dirname, '../images', post.image), (err) => {
            if (err) {
                console.log(err);
            }
        });
        const image = req.files.image;
        const uniqueIdentifier = new Date().getTime() + '_' + image.name;
        const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
        await image.mv(destination);
        post.image = `/${uniqueIdentifier}`;
    }
    await post.save();
    return res.status(StatusCodes.OK).json({post});
}

const deleteSinglePost = async(req, res) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id});
    if (post.user.toString() !== req.user.userID) {
        throw new CustomError.UnauthorizedError('You cannot delete someone elses post!');
    }
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    const destination = path.join(__dirname, '../images', post.image);
    await fs.unlink(destination, (err) => {
        if (err) {
            console.log(err);
        }
    });
    await post.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Successfully Deleted Post!'});
}

module.exports = {
    getAllPosts,
    userFeed,
    getCurrentUserPosts,
    getPostsFromUser,
    createPost,
    likePost,
    unlikePost,
    getSinglePost,
    updateSinglePost,
    deleteSinglePost
};