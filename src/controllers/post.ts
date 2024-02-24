import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {IPost} from '../models/Post';
import {IUser} from '../models/User';
import {User, Post, Comment} from '../models';
import CustomError from '../errors';
import {ITokenPayload, deleteImage} from '../utils';
import mongoose from 'mongoose';
import {UploadedFile} from 'express-fileupload';
import path from 'node:path';
import {v2 as cloudinary} from 'cloudinary';
import {removeStopwords} from 'stopword';

interface PostRequest extends Request {
    params: {
        id: string
    },
    body: IPost,
    query: {
        page: string,
        limit: string,
        search: string
    },
    user?: ITokenPayload
}

const getUserFeed = async(req: PostRequest, res: Response) => {
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
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
                    image: 1,
                    location: 1,
                    user: {
                        _id: 1, 
                        name: 1,
                        email: 1,
                        location: 1, 
                        profilePicture: 1 
                    },
                    likes: 1 
                }
            }
        ];
        const posts = await Post.aggregate([...aggregationPipeline, {$skip: skip}, {$limit: limit}]);
        const processedPosts = posts.map(post => {
            const likesConvertedToString = post.likes.map((objectId: string) => objectId.toString());
            return {...post, liked: likesConvertedToString.includes(req.user!.userID)};
        });
        const totalPosts = (await Post.aggregate(aggregationPipeline)).length;
        const numberOfPages = Math.ceil(totalPosts / limit);
        return res.status(StatusCodes.OK).json({posts: processedPosts, totalPosts, numberOfPages});
    }
    // If you follow someone youll see all of their posts
    const followingIds = loggedInUser.following.map(user => user.toString());
    let result = Post.find({user: {$in: followingIds}}).populate({
        path: 'user'
    });
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const posts = await result;
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map((objectId: any) => objectId.toString());
        return {...post, liked: likesConvertedToString.includes(req.user!.userID)};
    });
    const totalPosts = await Post.countDocuments({user: {$in: followingIds}});
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(StatusCodes.OK).json({posts: processedPosts, totalPosts, numberOfPages});
}

const createPost = async(req: PostRequest, res: Response) => {
    const {content} = req.body;
    if (!req.files?.image || !content) {
        throw new CustomError.BadRequestError('Please provide post content and image!');
    }
    const postImage = req.files?.image as UploadedFile;
    if (!postImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('File must be an image!');
    }
    if (postImage.size > 1000000 * 2) {
        throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'post' + '_' + postImage.name;
    const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
    await postImage.mv(destination);
    const result = await cloudinary.uploader.upload(destination, {
        public_id: uniqueIdentifier, 
        folder: 'ACTUALLY-PRIVATE/POST_IMAGES'
    });
    await deleteImage(destination);
    req.body.image = result.secure_url;
    req.body.user = req.user!.userID as unknown as mongoose.Schema.Types.ObjectId;
    const post = await Post.create(req.body);
    return res.status(StatusCodes.OK).json({post});
}

const getSinglePost = async(req: PostRequest, res: Response) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id}).populate('user');
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    const likesConvertedToString = post.likes.map(objectId => objectId.toString());
    // If your the owner of the post you can view it
    if ((post.user as unknown as IUser)._id.toString() === req.user!.userID) {
        return res.status(StatusCodes.OK).json({post, yourPost: true, liked: likesConvertedToString.includes(req.user!.userID)});
    }
    // Check if the posts user blocked you
    if ((post.user as unknown as IUser).blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        return res.status(StatusCodes.OK).json({msg: `${(post.user as unknown as IUser).name} has blocked you.`, redirectHome: true});
    }
    // Check if you blocked them
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        return res.status(StatusCodes.OK).json({msg: 'You have blocked this user', redirectHome: true});
    }
    // Check if the posts user is private and if you don't follow
    const loggedInUsersFollowingArray = loggedInUser.following.map(user => user.toString());
    if ((post.user as unknown as IUser).visibility === 'private' && !loggedInUsersFollowingArray.includes((post.user as unknown as IUser)._id.toString())) {
        return res.status(StatusCodes.OK).json({msg: 'The posts user is private and you dont follow them so you cannot see their post!', redirectHome: true});
    }
    return res.status(StatusCodes.OK).json({post, liked: likesConvertedToString.includes(req.user!.userID)});
}

const getSinglePostComments = async(req: PostRequest, res: Response) => {
    const {id} = req.params;
    let result = Comment.find({post: id}).populate('user');
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const comments = await result;
    const processedComments = comments.map(comment => {
        const likesConvertedToString = comment.likes.map(objectId => objectId.toString());
        return {...comment, liked: likesConvertedToString.includes(req.user!.userID), myComment: ((comment.user as unknown as IUser)._id).toString() === req.user!.userID};
    });
    const totalComments = await Comment.countDocuments({post: id});
    const numberOfPages = Math.ceil(totalComments / limit);
    return res.status(StatusCodes.OK).json({comments: processedComments, totalComments, numberOfPages});
}

const updateSinglePost = async(req: PostRequest, res: Response) => { 
    const {id} = req.params;
    const post = await Post.findOne({_id: id, user: req.user!.userID});
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    const {content, location} = req.body;
    if (content) {
        post.content = content;
    }
    if (location) {
        post.location = location;
    }
    if (req.files?.image) {
        const postImage = req.files?.image as UploadedFile;
        if (!postImage.mimetype.startsWith('image')) {
            throw new CustomError.BadRequestError('File must be an image!');
        }
        if (postImage.size > 1000000 * 2) {
            throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
        }
        if (post.image) {
            const oldImage = post.image.substring(post.image.indexOf('ACTUALLY'));
            await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'post' + '_' + postImage.name;
        const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
        await postImage.mv(destination);
        const result = await cloudinary.uploader.upload(destination, {
            public_id: uniqueIdentifier, 
            folder: 'ACTUALLY-PRIVATE/POST_IMAGES'
        });
        await deleteImage(destination);
        post.image = result.secure_url;
        await post.save();
    }
    await post.save();
    return res.status(StatusCodes.OK).json({post});
}

const deleteSinglePost = async(req: PostRequest, res: Response) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id, user: req.user!.userID});
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    // Delete All Comments
    post.comments.forEach(async(comment) => {
        await Comment.deleteOne({_id: comment})
    });
    // Check if Post has an Image and if it does delete it
    if (post.image) {
        const oldImage = post.image.substring(post.image.indexOf('ACTUALLY'));
        await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
    }
    await post.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Post!'});
}

const getUsersPosts = async(req: PostRequest, res: Response) => {
    let result = Post.find({user: req.user!.userID}).populate('user').select('-password');
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const posts = await result;
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map(objectId => objectId.toString());
        return {...post, liked: likesConvertedToString.includes(req.user!.userID)};
    });
    const totalPosts = await Post.countDocuments({user: req.user!.userID});
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(StatusCodes.OK).json({posts: processedPosts, totalPosts, numberOfPages});
}

// The reason why I chose to keep comment/like data is so it doesn't lead to 
// inconsistency. If a user blocks another user the interactions they had should 
// still remain. Because for others it would look confusing.

const likePost = async(req: PostRequest, res: Response) => {
    const {id} = req.params;
    const post = (await Post.findOne({_id: id}))!;
    // If its your post you can like it
    if ((post.user as unknown as IUser)._id.toString() === req.user!.userID) {
        await Post.findOneAndUpdate({_id: id}, {$addToSet: {likes: req.user!.userID}});
        return res.status(StatusCodes.CREATED).json({msg: 'Liked Post!'});
    }
    // Check if post exists
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    // Check if you blocked them
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new CustomError.BadRequestError('You cannot like the post of a person you blocked!');
    }
    // Check if this user blocked you
    const postsUser = (await User.findOne({_id: post.user}))!;
    if (postsUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You cannot like the post of a person that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postsUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new CustomError.BadRequestError(`You cannot like the post of someone you don't follow and they have their visibility set to private!`)
    }
    // Check if you already liked the post
    if (post.likes.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You have already liked this post!');
    }
    await Post.findOneAndUpdate({_id: id}, {$addToSet: {likes: req.user!.userID}});
    return res.status(StatusCodes.CREATED).json({msg: 'Liked Post!'});
}

const unlikePost = async(req: PostRequest, res: Response) => {
    const {id} = req.params;
    const post = (await Post.findOne({_id: id}))!;
    // Check if post exists
    if (!post) {
        throw new CustomError.NotFoundError('No Post Found with the ID Provided!');
    }
    // If its your post you can unlike it
    if ((post.user as unknown as IUser)._id.toString() === req.user!.userID) {
        await Post.findOneAndUpdate({_id: id}, {$pull: {likes: req.user!.userID}});
        return res.status(StatusCodes.CREATED).json({msg: 'Unliked Post!'});
    }
    // Check if you blocked them
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    if (loggedInUser.blockedUsers.includes(post.user)) {
        throw new CustomError.BadRequestError('You cannot unlike the post of a person you blocked!');
    }
    // Check if this user blocked you
    const postsUser = (await User.findOne({_id: post.user}))!;
    if (postsUser.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You cannot unlike the post of a person that blocked you!');
    }
    // Check if the posts user is private and if you don't follow them because that would be an error
    if (postsUser.visibility === 'private' && !loggedInUser.following.includes(post.user)) {
        throw new CustomError.BadRequestError(`You cannot unlike the post of someone you don't follow and they have their visibility set to private!`)
    }
    // Check if you you even liked this post, and if you didn't throw an error
    if (!post.likes.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError(`You can't unlike something you never liked!`);
    }
    await Post.findOneAndUpdate({_id: id}, {$pull: {likes: req.user!.userID}});
    return res.status(StatusCodes.CREATED).json({msg: 'Unliked Post!'});
}

const getSingleUserPosts = async(req: PostRequest, res: Response) => {
    const {id: userID} = req.params;
    const postsUser = (await User.findById(userID))!;
    const loggedInUser = (await User.findById(req.user!.userID))!;
    if (!postsUser) {
        throw new CustomError.NotFoundError('No User Posts Found with the ID Provided!');
    }
    // Check if you blocked this user
    if (loggedInUser.blockedUsers.includes(postsUser._id)) {
        throw new CustomError.BadRequestError('You have blocked this user');
    }
    // Check if the postsUser blocked you
    if (postsUser.blockedUsers.includes(loggedInUser._id)) {
        throw new CustomError.BadRequestError('You cannot view the posts of someone that blocked you!');
    }
    // Check if the posts user is private and if you don't follow
    if (postsUser.visibility === 'private' && !loggedInUser.following.includes(postsUser._id)) {
        throw new CustomError.BadRequestError('The user is private and you dont follow them so you cannot see their posts!');
    }
    // Return Posts 
    let result = Post.find({user: userID}).populate('user').select('-password');
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit).lean();
    const posts = await result;
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map(objectId => objectId.toString());
        return {...post, liked: likesConvertedToString.includes(req.user!.userID)};
    });
    const totalPosts = await Post.countDocuments({user: userID});
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(StatusCodes.OK).json({posts: processedPosts, totalPosts, numberOfPages});
}

const getTrendingTopics = async(req: PostRequest, res: Response) => {
    const posts = await Post.find();
    const wordCount: {[index: string]: number} = {};
    posts.forEach(post => {
        // Using the "stopword" third party module I have excluded some common words from
        // my search and used regex to remove all numbers. So only keywords.
        const words = post.content.toLowerCase().match(/\b[a-z]+\b/g) || []; 
        const filteredWords = removeStopwords(words);
        filteredWords.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
    });
    const sortedWords = Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]);
    const top10Words = sortedWords.slice(0, 10);
    return res.status(StatusCodes.OK).json({trending: top10Words});
}

const globalSearch = async(req: PostRequest, res: Response) => {
    const { search } = req.query;
    const matchStage: any = {};
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
                content: 1,
                image: 1,
                location: 1,
                user: {
                    _id: 1, 
                    name: 1,
                    email: 1,
                    location: 1, 
                    profilePicture: 1 
                },
                likes: 1 
            }
        }
    ];
    const posts = await Post.aggregate([...aggregationPipeline, {$skip: skip}, {$limit: limit}]);
    const processedPosts = posts.map(post => {
        const likesConvertedToString = post.likes.map((objectId: string) => objectId.toString());
        return {...post, liked: likesConvertedToString.includes(req.user!.userID)};
    });
    const totalPosts = (await Post.aggregate(aggregationPipeline)).length;
    const numberOfPages = Math.ceil(totalPosts / limit);
    return res.status(StatusCodes.OK).json({posts: processedPosts, totalPosts, numberOfPages});
}

export {
    getUserFeed,
    createPost,
    getSinglePost,
    getSinglePostComments,
    updateSinglePost,
    deleteSinglePost,
    getUsersPosts,
    likePost,
    unlikePost,
    getSingleUserPosts,
    getTrendingTopics,
    globalSearch
};