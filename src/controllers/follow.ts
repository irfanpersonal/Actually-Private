import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {UserRequest, IQueryObject} from './user';
import CustomError from '../errors';
import {User, FollowRequest} from '../models';
import {formatDuration} from '../utils';
import mongoose from 'mongoose';

const followUser = async (req: UserRequest, res: Response) => {
    const {id} = req.params;
    // Check if the id is the logged in user and if so throw an error
    if (id === req.user!.userID) {
        throw new CustomError.NotFoundError('You cant follow yourself.');
    }
    const user = (await User.findOne({_id: req.user!.userID}))!;
    // Check if you blocked the person you are trying to follow
    if (user.blockedUsers.includes(id as any)) {
        throw new CustomError.BadRequestError('You cannot follow someone that you blocked!');
    }
    // Check if you are already following the user
    if (user.following.includes(id as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You are already following the user.');
    }
    // Check if the person you are trying to follow even exists
    const targetUser = await User.findOne({_id: id});
    if (!targetUser) {
        throw new CustomError.NotFoundError('The person you are trying to follow does not exist!');
    }
    // Check if the target user has blocked you
    if (targetUser.blockedUsers.includes(req.user!.userID as any)) {
        throw new CustomError.BadRequestError('You cannot follow someone that has blocked you!');
    }
    // Check if targetUser is private and if so tell them they need to create a follow request
    if (targetUser.visibility === 'private') {
        const alreadyCreatedFollowRequest = await FollowRequest.findOne({from: req.user!.userID, to: id});
        if (alreadyCreatedFollowRequest) {
            throw new CustomError.BadRequestError('You already created a follow request, now just wait for the user to accept your follow request!');
        }
        throw new CustomError.BadRequestError('You must create a follow request to follow this person!');
    }
    // Do the following and update the array of following for the user who is doing the following and updating the array of followers for the user who is being followed 
    await Promise.all([
        User.findOneAndUpdate({_id: req.user!.userID}, {$addToSet: {following: id}}),
        User.findOneAndUpdate({_id: id}, {$addToSet: {followers: req.user!.userID}})
    ]);
    return res.status(StatusCodes.OK).json({msg: 'Successfully Followed Provided User!'});
}

const createFollowRequest = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    if (id === req.user!.userID) {
        throw new CustomError.BadRequestError('You cannot create a follow request for yourself!');
    }
    const user = (await User.findOne({_id: id}))!;
    // Check if the target user has blocked you
    if (user.blockedUsers.includes(req.user!.userID as any)) {
        throw new CustomError.BadRequestError('You cannot send a follow request to someone that has blocked you!');
    }
    if (!user) {
        throw new CustomError.BadRequestError(`The user you are trying to create a follow request for doesn't exist`);
    }
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    // Check if the loggedIn user has blocked you
    if (loggedInUser.blockedUsers.includes(id as any)) {
        throw new CustomError.BadRequestError('You cannot send a follow request to someone that you blocked!');
    }
    // Check if Cooldown is present for this user, and if your in the timeframe to where you can create another follow request and if not throw an error
    const cooldownExpiration = loggedInUser.followRequestCooldowns.get(id);
    if (cooldownExpiration && cooldownExpiration > new Date()) {
        const remainingTime = cooldownExpiration.getTime() - Date.now();
        const remainingTimeInSeconds = Math.ceil(remainingTime / 1000);
        const remainingTimeFormatted = formatDuration(remainingTimeInSeconds);
        throw new CustomError.BadRequestError(`You need to wait ${remainingTimeFormatted} before you can send another follow request`);
    }
    if (user.visibility !== 'private') {
        throw new CustomError.BadRequestError('You can only create a follow request for a private user!');
    }
    const alreadyCreatedFollowRequest = await FollowRequest.findOne({from: req.user!.userID, to: id});
    if (alreadyCreatedFollowRequest) {
        throw new CustomError.BadRequestError('You already sent a follow request to this private user!');
    }
    // Check if a coolDownExpiration exists for the user you are creating a follow request for and if so delete it
    if (cooldownExpiration) {
        loggedInUser.followRequestCooldowns.delete(id);
        await loggedInUser.save();
    }
    await FollowRequest.create({
        from: req.user!.userID,
        to: id
    });
    return res.status(StatusCodes.CREATED).json({msg: 'Successfully Sent Follow Request'});
}

const deleteFollowRequest = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    const followRequest = (await FollowRequest.findOne({from: req.user!.userID, to: id}))!;
    if (!followRequest) {
        throw new CustomError.NotFoundError('No Follow Request Found with the ID Provided!');
    }
    await followRequest.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Follow Request'});
}

const viewAllFollowRequests = async(req: UserRequest, res: Response) => {
    const {search} = req.query;
    const queryObject: IQueryObject = {
        to: req.user!.userID as unknown as mongoose.Schema.Types.ObjectId
    };
    if (search) {
        const user = await User.findOne({name: search});
        if (user) {
            queryObject.from = user._id;
        }
        else {
            queryObject.from = req.user!.userID as any;
        }
    }
    let result = FollowRequest.find(queryObject).populate({
        path: 'from',
        select: 'name profilePicture'
    });
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const followRequests = await result;
    const totalFollowRequests = await FollowRequest.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalFollowRequests / limit);
    return res.status(StatusCodes.OK).json({followRequests, totalFollowRequests, numberOfPages});
}

const updateFollowRequest = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    const {status} = req.body;
    if (status !== 'accepted' && status !== 'rejected') {
        throw new CustomError.BadRequestError('Status can only be accepted or rejected!');
    }
    const followRequest = (await FollowRequest.findOne({_id: id, to: req.user!.userID}))!;
    if (!followRequest) {
        throw new CustomError.NotFoundError('No Follow Request Found with the ID Provided!');
    }
    if (status === 'accepted') {
        // Update Following and Followers Array
        await Promise.all([
            User.findOneAndUpdate({_id: req.user!.userID}, {$addToSet: {followers: followRequest.from}}),
            User.findOneAndUpdate({_id: followRequest.from}, {$addToSet: {following: req.user!.userID}})
        ]);
        // Delete the Follow Request
        await followRequest.deleteOne();
        return res.status(StatusCodes.OK).json({msg: 'Accepted Follow Request!'});
    }
    else if (status === 'rejected') {
        // Add this User into your Map Cooldown
        const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const cooldownExpiration = new Date(Date.now() + cooldownDuration);
        await User.findOneAndUpdate({_id: followRequest.from}, {
            $set: { [`followRequestCooldowns.${followRequest.to}`]: cooldownExpiration }
        });
        // Delete the Follow Request
        await followRequest.deleteOne();
        return res.status(StatusCodes.OK).json({msg: 'Rejected Follow Request!'});
    }
    return res.status(StatusCodes.OK).json({followRequest});
}

const unfollowUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    if (id === req.user!.userID) {
        throw new CustomError.NotFoundError('You cant follow yourself.');
    }
    const isFollowing = await User.exists({_id: req.user!.userID, following: id});
    if (!isFollowing) {
        throw new CustomError.BadRequestError(`You cant unfollow someone you aren't followed to.`);
    }
    await User.findOneAndUpdate({_id: req.user!.userID}, {$pull: {following: id}});
    await User.findOneAndUpdate({_id: id}, {$pull: {followers: req.user!.userID}});
    return res.status(StatusCodes.OK).json({msg: 'Successfully Unfollowed Provided User!'});
}

export {
    followUser,
    createFollowRequest,
    deleteFollowRequest,
    viewAllFollowRequests,
    updateFollowRequest,
    unfollowUser
};