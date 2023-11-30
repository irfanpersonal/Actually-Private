const CustomError = require('./custom-error.js');
const BadRequestError = require('./bad-request-error.js');
const NotFoundError = require('./not-found-error.js');
const UnauthorizedError = require('./unauthorized-error.js');

module.exports = {
    CustomError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError
};