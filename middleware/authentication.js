const CustomError = require('../errors');
const {verifyToken} = require('../utils');

const authentication = (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        if (!token) {
            throw new CustomError.UnauthorizedError('Missing/Invalid Token');
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next(); 
    }
    catch(error) {
        throw new CustomError.UnauthorizedError('Failed to Authenticate User!');
    }
}

module.exports = authentication;