"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, try again later!'
    };
    // Duplicate Value Provided
    if (err && err.code === 11000) {
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        customError.message = 'Someone already took the name/email provided!';
    }
    // ValidationError
    if (err.name === 'ValidationError') {
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        const errorKeys = Object.keys(err.errors);
        if (errorKeys.length === 1) {
            customError.message = `Please provide/check input for ${Object.keys(err.errors)[0]}`;
        }
        else {
            customError.message = `Please provide/check input for ${Object.keys(err.errors).map((key, index, array) => {
                return index === array.length - 1 ? `and ${key}` : `${key}, `;
            }).join('')}`;
        }
    }
    // CastError
    if (err.name === 'CastError') {
        customError.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
        customError.message = 'Nothing Found with the Information Provided!';
    }
    return res.status(customError.statusCode).json({ msg: customError.message });
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};
exports.default = errorHandler;
