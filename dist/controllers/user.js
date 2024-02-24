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
exports.updateUserPassword = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.getProfileData = exports.showCurrentUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const utils_1 = require("../utils");
const models_1 = require("../models");
const cloudinary_1 = require("cloudinary");
const node_path_1 = __importDefault(require("node:path"));
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const getProfileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findById({ _id: req.user.userID }).select('-password');
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getProfileData = getProfileData;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const queryObject = {
        role: 'user'
    };
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }
    let result = models_1.User.find(queryObject).select('-password');
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const users = yield result;
    const processedUsers = users.map(user => {
        const { _id, createdAt, updatedAt, visibility, name, profilePicture, dateOfBirth, location, bio, followers, following } = user;
        if (user.followers.includes(req.user.userID)) {
            return { _id, createdAt, updatedAt, visibility, name, profilePicture, dateOfBirth, location, bio, followers, following };
        }
        else {
            if (visibility === 'private') {
                return { _id, createdAt, updatedAt, visibility, name, profilePicture, bio, followers: followers.length, following: following.length };
            }
            else {
                return { _id, createdAt, updatedAt, visibility, name, profilePicture, dateOfBirth, location, bio, followers, following };
            }
        }
    });
    const totalUsers = yield models_1.User.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ users: processedUsers, totalUsers, numberOfPages });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield models_1.User.findOne({ _id: id }).select('-password');
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    const followersToString = user.followers.map(follower => follower.toString());
    // If its your account you can view it
    if (id === req.user.userID) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
    }
    // Check if the user blocked you
    if (user.blockedUsers.includes(req.user.userID)) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: `${user.name} has blocked you.`, isBlockedByYou: false, didUserBlockMe: user.blockedUsers.includes(req.user.userID), user });
    }
    // Check if you blocked the user
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (loggedInUser.blockedUsers.includes(user._id)) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'You have blocked this user', isBlockedByYou: true, user });
    }
    // Check if the posts user is private and if you don't follow
    if (user.visibility === 'private' && !loggedInUser.following.includes(user._id)) {
        const sentFollowRequest = yield models_1.FollowRequest.findOne({ from: req.user.userID, to: id });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'The posts user is private and you dont follow them so you cannot see their posts!', sentFollowRequest, user });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user, isFollowing: followersToString.includes(req.user.userID), canViewPosts: true });
});
exports.getSingleUser = getSingleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const updatedUser = (yield models_1.User.findOneAndUpdate({ _id: req.user.userID }, req.body, {
        new: true,
        runValidators: true,
    }).select('-password'));
    if (req.body.visibility === 'public') {
        // Make it so that all the people who sent me a follow request automatically follow me
        const allFollowRequestsForMe = yield models_1.FollowRequest.find({ to: req.user.userID });
        allFollowRequestsForMe.forEach((followRequest) => __awaiter(void 0, void 0, void 0, function* () {
            yield models_1.User.findByIdAndUpdate(req.user.userID, { $addToSet: { followers: followRequest.from } });
            yield models_1.User.findByIdAndUpdate(followRequest.from, { $addToSet: { following: req.user.userID } });
        }));
        // Remove All Follow Requests to the Currently Logged In User!
        yield models_1.FollowRequest.deleteMany({ to: req.user.userID });
    }
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.profilePicture) {
        const profilePicture = req.files.profilePicture;
        if (!profilePicture.mimetype.startsWith('image')) {
            throw new errors_1.default.BadRequestError('File must be an image!');
        }
        if (profilePicture.size > 1000000 * 2) {
            throw new errors_1.default.BadRequestError('Image Size cannot be over 2MB!');
        }
        if (updatedUser.profilePicture) {
            const oldImage = updatedUser.profilePicture.substring(updatedUser.profilePicture.indexOf('ACTUALLY'));
            yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'profile' + '_' + profilePicture.name;
        const destination = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifier);
        yield profilePicture.mv(destination);
        const result = yield cloudinary_1.v2.uploader.upload(destination, {
            public_id: uniqueIdentifier,
            folder: 'ACTUALLY-PRIVATE/PROFILE_IMAGES'
        });
        yield (0, utils_1.deleteImage)(destination);
        updatedUser.profilePicture = result.secure_url;
        yield updatedUser.save();
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: updatedUser });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.default.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (yield models_1.User.findOne({ _id: req.user.userID }));
    const isCorrect = yield user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    yield user.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: {
            userID: user._id,
            name: user.name,
            email: user.email
        } });
});
exports.updateUserPassword = updateUserPassword;
