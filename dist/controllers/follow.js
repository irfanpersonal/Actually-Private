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
exports.unfollowUser = exports.updateFollowRequest = exports.viewAllFollowRequests = exports.deleteFollowRequest = exports.createFollowRequest = exports.followUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Check if the id is the logged in user and if so throw an error
    if (id === req.user.userID) {
        throw new errors_1.default.NotFoundError('You cant follow yourself.');
    }
    const user = (yield models_1.User.findOne({ _id: req.user.userID }));
    // Check if you blocked the person you are trying to follow
    if (user.blockedUsers.includes(id)) {
        throw new errors_1.default.BadRequestError('You cannot follow someone that you blocked!');
    }
    // Check if you are already following the user
    if (user.following.includes(id)) {
        throw new errors_1.default.BadRequestError('You are already following the user.');
    }
    // Check if the person you are trying to follow even exists
    const targetUser = yield models_1.User.findOne({ _id: id });
    if (!targetUser) {
        throw new errors_1.default.NotFoundError('The person you are trying to follow does not exist!');
    }
    // Check if the target user has blocked you
    if (targetUser.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot follow someone that has blocked you!');
    }
    // Check if targetUser is private and if so tell them they need to create a follow request
    if (targetUser.visibility === 'private') {
        const alreadyCreatedFollowRequest = yield models_1.FollowRequest.findOne({ from: req.user.userID, to: id });
        if (alreadyCreatedFollowRequest) {
            throw new errors_1.default.BadRequestError('You already created a follow request, now just wait for the user to accept your follow request!');
        }
        throw new errors_1.default.BadRequestError('You must create a follow request to follow this person!');
    }
    // Do the following and update the array of following for the user who is doing the following and updating the array of followers for the user who is being followed 
    yield Promise.all([
        models_1.User.findOneAndUpdate({ _id: req.user.userID }, { $addToSet: { following: id } }),
        models_1.User.findOneAndUpdate({ _id: id }, { $addToSet: { followers: req.user.userID } })
    ]);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Successfully Followed Provided User!' });
});
exports.followUser = followUser;
const createFollowRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id === req.user.userID) {
        throw new errors_1.default.BadRequestError('You cannot create a follow request for yourself!');
    }
    const user = (yield models_1.User.findOne({ _id: id }));
    // Check if the target user has blocked you
    if (user.blockedUsers.includes(req.user.userID)) {
        throw new errors_1.default.BadRequestError('You cannot send a follow request to someone that has blocked you!');
    }
    if (!user) {
        throw new errors_1.default.BadRequestError(`The user you are trying to create a follow request for doesn't exist`);
    }
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    // Check if the loggedIn user has blocked you
    if (loggedInUser.blockedUsers.includes(id)) {
        throw new errors_1.default.BadRequestError('You cannot send a follow request to someone that you blocked!');
    }
    // Check if Cooldown is present for this user, and if your in the timeframe to where you can create another follow request and if not throw an error
    const cooldownExpiration = loggedInUser.followRequestCooldowns.get(id);
    if (cooldownExpiration && cooldownExpiration > new Date()) {
        const remainingTime = cooldownExpiration.getTime() - Date.now();
        const remainingTimeInSeconds = Math.ceil(remainingTime / 1000);
        const remainingTimeFormatted = (0, utils_1.formatDuration)(remainingTimeInSeconds);
        throw new errors_1.default.BadRequestError(`You need to wait ${remainingTimeFormatted} before you can send another follow request`);
    }
    if (user.visibility !== 'private') {
        throw new errors_1.default.BadRequestError('You can only create a follow request for a private user!');
    }
    const alreadyCreatedFollowRequest = yield models_1.FollowRequest.findOne({ from: req.user.userID, to: id });
    if (alreadyCreatedFollowRequest) {
        throw new errors_1.default.BadRequestError('You already sent a follow request to this private user!');
    }
    // Check if a coolDownExpiration exists for the user you are creating a follow request for and if so delete it
    if (cooldownExpiration) {
        loggedInUser.followRequestCooldowns.delete(id);
        yield loggedInUser.save();
    }
    yield models_1.FollowRequest.create({
        from: req.user.userID,
        to: id
    });
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: 'Successfully Sent Follow Request' });
});
exports.createFollowRequest = createFollowRequest;
const deleteFollowRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const followRequest = (yield models_1.FollowRequest.findOne({ from: req.user.userID, to: id }));
    if (!followRequest) {
        throw new errors_1.default.NotFoundError('No Follow Request Found with the ID Provided!');
    }
    yield followRequest.deleteOne();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Follow Request' });
});
exports.deleteFollowRequest = deleteFollowRequest;
const viewAllFollowRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const queryObject = {
        to: req.user.userID
    };
    if (search) {
        const user = yield models_1.User.findOne({ name: search });
        if (user) {
            queryObject.from = user._id;
        }
        else {
            queryObject.from = req.user.userID;
        }
    }
    let result = models_1.FollowRequest.find(queryObject).populate({
        path: 'from',
        select: 'name profilePicture'
    });
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const followRequests = yield result;
    const totalFollowRequests = yield models_1.FollowRequest.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalFollowRequests / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ followRequests, totalFollowRequests, numberOfPages });
});
exports.viewAllFollowRequests = viewAllFollowRequests;
const updateFollowRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== 'accepted' && status !== 'rejected') {
        throw new errors_1.default.BadRequestError('Status can only be accepted or rejected!');
    }
    const followRequest = (yield models_1.FollowRequest.findOne({ _id: id, to: req.user.userID }));
    if (!followRequest) {
        throw new errors_1.default.NotFoundError('No Follow Request Found with the ID Provided!');
    }
    if (status === 'accepted') {
        // Update Following and Followers Array
        yield Promise.all([
            models_1.User.findOneAndUpdate({ _id: req.user.userID }, { $addToSet: { followers: followRequest.from } }),
            models_1.User.findOneAndUpdate({ _id: followRequest.from }, { $addToSet: { following: req.user.userID } })
        ]);
        // Delete the Follow Request
        yield followRequest.deleteOne();
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Accepted Follow Request!' });
    }
    else if (status === 'rejected') {
        // Add this User into your Map Cooldown
        const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const cooldownExpiration = new Date(Date.now() + cooldownDuration);
        yield models_1.User.findOneAndUpdate({ _id: followRequest.from }, {
            $set: { [`followRequestCooldowns.${followRequest.to}`]: cooldownExpiration }
        });
        // Delete the Follow Request
        yield followRequest.deleteOne();
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Rejected Follow Request!' });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ followRequest });
});
exports.updateFollowRequest = updateFollowRequest;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id === req.user.userID) {
        throw new errors_1.default.NotFoundError('You cant follow yourself.');
    }
    const isFollowing = yield models_1.User.exists({ _id: req.user.userID, following: id });
    if (!isFollowing) {
        throw new errors_1.default.BadRequestError(`You cant unfollow someone you aren't followed to.`);
    }
    yield models_1.User.findOneAndUpdate({ _id: req.user.userID }, { $pull: { following: id } });
    yield models_1.User.findOneAndUpdate({ _id: id }, { $pull: { followers: req.user.userID } });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Successfully Unfollowed Provided User!' });
});
exports.unfollowUser = unfollowUser;
