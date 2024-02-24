import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {UserRequest} from './user';
import CustomError from '../errors';
import {User, FollowRequest} from '../models';

const blockUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    if (id === req.user!.userID) {
        throw new CustomError.BadRequestError('You cannot block yourself!');
    }
    const user = await User.findOne({_id: id});
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    // Check if you already blocked the provided user and if so throw an error
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    if (loggedInUser.blockedUsers.includes(id as any)) {
        throw new CustomError.BadRequestError('You already blocked this user!');
    }
    // Delete Any Follow Requests sent to the loggedInUser from the provided user
    await FollowRequest.deleteMany({to: req.user!.userID, from: id});
    await FollowRequest.deleteMany({to: id, from: req.user!.userID});
    // Update followers and following array 
    await User.findOneAndUpdate({_id: req.user!.userID}, {$pull: {following: id, followers: id}});
    await User.findOneAndUpdate({_id: id}, {$pull: {followers: req.user!.userID, following: req.user!.userID}});
    // Block the provided user
    loggedInUser.blockedUsers.push(id as any);
    await loggedInUser.save();
    return res.status(StatusCodes.OK).json({msg: 'Blocked User!'});
}

const unblockUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    if (id === req.user!.userID) {
        throw new CustomError.BadRequestError('You cannot unblock yourself!');
    }
    const user = (await User.findOne({_id: id}))!;
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    const loggedInUser = (await User.findOne({_id: req.user!.userID}))!;
    if (!loggedInUser.blockedUsers.includes(id as any)) {
        throw new CustomError.BadRequestError(`You can't unblock someone you haven't blocked!`);
    }
    await User.findOneAndUpdate({_id: req.user!.userID}, {$pull: {blockedUsers: id}});
    return res.status(StatusCodes.OK).json({msg: 'Unblocked User!'});
}

export {
    blockUser,
    unblockUser
};