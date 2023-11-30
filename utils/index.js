const jwt = require('jsonwebtoken');

const createJWT = (user) => {
    return jwt.sign(
        {userID: user._id, name: user.name, email: user.email, location: user.location, bio: user.bio, profilePicture: user.profilePicture, following: user.following, followers: user.followers},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    );
}

const attachCookiesToResponse = (res, token) => {
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    createJWT,
    attachCookiesToResponse,
    verifyToken
};