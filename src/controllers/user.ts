import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import CustomError from '../errors';
import {ITokenPayload, deleteFile} from '../utils';
import {IUser} from '../models/User';
import {IFollowRequest} from '../models/FollowRequest';
import {User, FollowRequest} from '../models';
import {v2 as cloudinary} from 'cloudinary';
import {UploadedFile} from 'express-fileupload';
import path from 'node:path';
import mongoose from 'mongoose';

export interface UserRequest extends Request {
    params: {
        id: string
    },
    body: IUser & IFollowRequest & {
        oldPassword: string,
        newPassword: string,
        status: 'accepted' | 'rejected'
    },
    query: {
        search: string,
        page: string,
        limit: string
    },
    user?: ITokenPayload
}

const showCurrentUser = async(req: UserRequest, res: Response) => {
    const user = await User.findById(req.user!.userID).select('-password');
    return res.status(StatusCodes.OK).json({user});
}

const getProfileData = async(req: UserRequest, res: Response) => {
    const user = await User.findById({_id: req.user!.userID}).select('-password');
    return res.status(StatusCodes.OK).json({user});
}

export interface IQueryObject {
    role?: 'user' | 'admin',
    name?: {$regex: string, $options: string},
    from?: mongoose.Schema.Types.ObjectId,
    to?: mongoose.Schema.Types.ObjectId
}

const getAllUsers = async(req: UserRequest, res: Response) => {
    const {search} = req.query;
    const queryObject: IQueryObject = {
        role: 'user'
    };
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    let result = User.find(queryObject).select('-password');
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const users = await result;
    const processedUsers = users.map(user => {
        const {_id, createdAt, updatedAt, visibility, name, profilePicture, dateOfBirth, location, bio, followers, following} = user;
        if (user.followers.includes(req.user!.userID as any)) {
            return {_id, createdAt, updatedAt, visibility, name, profilePicture, dateOfBirth, location, bio, followers, following};
        }
        else {
            if (visibility === 'private') {
                return {_id, createdAt, updatedAt, visibility, name, profilePicture, bio, followers: followers.length, following: following.length};
            } else {
                return {_id, createdAt, updatedAt, visibility, name, profilePicture, dateOfBirth, location, bio, followers, following};
            }
        }
    }); 
    const totalUsers = await User.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(StatusCodes.OK).json({users: processedUsers, totalUsers, numberOfPages});
}

const getSingleUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    const user = await User.findOne({_id: id}).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    const followersToString = user.followers.map(follower => follower.toString());
    // If its your account you can view it
    if (id === req.user!.userID) {
        return res.status(StatusCodes.OK).json({user});
    }
    // Check if the user blocked you
    if (user.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId)) {
        return res.status(StatusCodes.OK).json({msg: `${(user.name as unknown as IUser)} has blocked you.`, isBlockedByYou: false, didUserBlockMe: user.blockedUsers.includes(req.user!.userID as unknown as mongoose.Schema.Types.ObjectId), user});
    }
    // Check if you blocked the user
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    if (loggedInUser.blockedUsers.includes(user._id)) {
        return res.status(StatusCodes.OK).json({msg: 'You have blocked this user', isBlockedByYou: true, user});
    }
    // Check if the posts user is private and if you don't follow
    if (user.visibility === 'private' && !loggedInUser.following.includes(user._id)) {
        const sentFollowRequest = await FollowRequest.findOne({from: req.user!.userID, to: id});
        return res.status(StatusCodes.OK).json({msg: 'The posts user is private and you dont follow them so you cannot see their posts!', sentFollowRequest, user});
    }
    return res.status(StatusCodes.OK).json({user, isFollowing: followersToString.includes(req.user!.userID), canViewPosts: true});
}

const updateUser = async(req: UserRequest, res: Response) => {
    req.body.name = req.body.name.replace(/\s+/g, '');
    const updatedUser = (await User.findOneAndUpdate({_id: req.user!.userID}, req.body, {
        new: true,
        runValidators: true
    }).select('-password'))!;
    if (req.body.visibility === 'public') {
        // Make it so that all the people who sent me a follow request automatically follow me
        const allFollowRequestsForMe = await FollowRequest.find({to: req.user!.userID});
        allFollowRequestsForMe.forEach(async(followRequest) => {
            await User.findByIdAndUpdate(req.user!.userID, {$addToSet: {followers: followRequest.from}});
            await User.findByIdAndUpdate(followRequest.from, {$addToSet: {following: req.user!.userID}});
        });
        // Remove All Follow Requests to the Currently Logged In User!
        await FollowRequest.deleteMany({to: req.user!.userID});
    }
    if (req.files?.profilePicture) {
        const profilePicture = req.files.profilePicture as UploadedFile;
        if (!profilePicture.mimetype.startsWith('image')) {
            throw new CustomError.BadRequestError('File must be an image!');
        }
        if (profilePicture.size > 1000000 * 2) {
            throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
        }
        if (updatedUser.profilePicture) {
            const oldImage = updatedUser.profilePicture.substring(updatedUser.profilePicture.indexOf('ACTUALLY'));
            await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'profile' + '_' + profilePicture.name;
        const destination = path.resolve(__dirname, '../files', uniqueIdentifier);
        await profilePicture.mv(destination);
        const result = await cloudinary.uploader.upload(destination, {
            public_id: uniqueIdentifier, 
            folder: 'ACTUALLY-PRIVATE/PROFILE_IMAGES'
        });
        await deleteFile(destination);
        updatedUser.profilePicture = result.secure_url;
        await updatedUser.save();
    }
    return res.status(StatusCodes.OK).json({user: updatedUser});
}

const updateUserPassword = async(req: UserRequest, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (await User.findOne({_id: req.user!.userID}))!;
    const isCorrect = await user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    await user.save();
    return res.status(StatusCodes.OK).json({user: {
        userID: user._id,
        name: user.name,
        email: user.email
    }});
}

const discoverPeople = async(req: UserRequest, res: Response) => {
    const users = await User.find({
        role: {
            $ne: 'admin'
        },
        _id: {
            $ne: req.user!.userID
        }
    });
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    const randomThree = shuffledUsers.slice(0, 3);
    return res.status(StatusCodes.OK).json({users: randomThree});
}

export {
    showCurrentUser,
    getProfileData,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
    discoverPeople
};