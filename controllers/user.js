const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const User = require('../models/User.js');
const fs = require('node:fs');
const path = require('node:path');
const {createJWT, attachCookiesToResponse } = require('../utils/index.js');

const getAllUsers = async(req, res) => {
    const {search} = req.query;
    const queryObject = {};
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    let result = User.find(queryObject);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const users = await result;
    const totalUsers = await User.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(StatusCodes.OK).json({users, totalUsers, numberOfPages});
}

const showCurrentUser = async(req, res) => {
    return res.status(StatusCodes.OK).json({user: req.user});
}

const getSingleUser = async(req, res) => {
    const {id} = req.params;
    const user = await User.findOne({_id: id}).select('-password').populate('following followers');
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({user});
}

const followUser = async (req, res) => {
    const {id} = req.params;
    if (id === req.user.userID) {
        throw new CustomError.NotFoundError('You cant follow yourself.');
    }
    const user = await User.findOne({_id: req.user.userID});
    if (user.following.includes(id)) {
        throw new CustomError.BadRequestError('You are already following the user.');
    }
    const [findUser, findTargetUser] = await Promise.all([
        User.findOneAndUpdate({_id: req.user.userID}, {$addToSet: {following: id}}),
        User.findOneAndUpdate({_id: id}, {$addToSet: {followers: req.user.userID}})
    ]);
    if (!findUser || !findTargetUser) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({msg: 'Successfully Followed Provided User!', user: req.user});
};

const unfollowUser = async (req, res) => {
    const {id} = req.params;
    if (id === req.user.userID) {
        throw new CustomError.NotFoundError('You cant follow yourself.');
    }
    const isFollowing = await User.exists({_id: req.user.userID, following: id});
    if (!isFollowing) {
        throw new CustomError.BadRequestError(`You cant unfollow someone you aren't followed to.`);
    }
    const [findUser, findTargetUser] = await Promise.all([
        User.findOneAndUpdate({_id: req.user.userID}, {$pull: {following: id}}),
        User.findOneAndUpdate({_id: id}, {$pull: {followers: req.user.userID}})
    ]);
    if (!findUser || !findTargetUser) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({msg: 'Successfully Unfollowed Provided User!', user: req.user});
};

const updateUser = async(req, res) => {
    const {name, email, location, bio} = req.body;
    const user = await User.findOne({_id: req.user.userID}).select('-password');
    if (name) {
        user.name = name;
    }
    if (email) {
        user.email = email;
    }
    if (location) {
        user.location = location;
    }
    if (bio) {
        user.bio = bio;
    }
    if (req?.files?.profilePicture) {
        if (user.profilePicture) {
            await fs.unlink(path.join(__dirname, '../images', user.profilePicture), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        const profilePicture = req.files.profilePicture;
        const uniqueIdentifier = new Date().getTime() + '_' + profilePicture.name;
        const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
        await profilePicture.mv(destination);
        user.profilePicture = `/${uniqueIdentifier}`;
    }
    await user.save();
    const token = createJWT(user);
    attachCookiesToResponse(res, token);
    return res.status(StatusCodes.OK).json({user});
}

const updateUserPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = await User.findOne({_id: req.user.userID});
    const isOldPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isOldPasswordCorrect) {
        throw new CustomError.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    await user.save();
    const token = createJWT(user);
    attachCookiesToResponse(res, token);
    return res.status(StatusCodes.OK).json({user});
}


module.exports = {
    getAllUsers,
    showCurrentUser,
    getSingleUser,
    updateUser,
    updateUserPassword,
    followUser,
    unfollowUser
};