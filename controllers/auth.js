const {StatusCodes} = require('http-status-codes');
const {createJWT, attachCookiesToResponse} = require('../utils');
const User = require('../models/User.js');
const CustomError = require('../errors');

const register = async(req, res) => {
    const user = await User.create(req.body);
    await user.populate('following followers');
    const token = createJWT(user);
    attachCookiesToResponse(res, token);
    return res.status(StatusCodes.CREATED).json({user: {
        userID: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        profilePicture: user.profilePicture,
        following: user.following,
        followers: user.followers
    }});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password!');
    }
    const user = await User.findOne({email}).populate('following followers');
    if (!user) {
        throw new CustomError.NotFoundError('No User found with the Email provided!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Invalid Password!');
    }
    const token = createJWT(user);
    attachCookiesToResponse(res, token);
    return res.status(StatusCodes.OK).json({user: {
        userID: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        profilePicture: user.profilePicture,
        following: user.following,
        followers: user.followers
    }});
}

const logout = async(req, res) => {
    res.clearCookie('token');
    return res.status(StatusCodes.OK).json({msg: 'Successfully Logged Out!'});
}

module.exports = {
    register,
    login,
    logout
};