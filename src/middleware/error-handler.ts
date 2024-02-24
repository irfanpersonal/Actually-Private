import {StatusCodes} from 'http-status-codes';
import {Request, Response, NextFunction} from 'express';

interface ICustomError {
    statusCode: number,
    message: string
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let customError: ICustomError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, try again later!'
    };
    // Duplicate Value Provided
    if (err && err.code === 11000) {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = 'Someone already took the name/email provided!';
    }
    // ValidationError
    if (err.name === 'ValidationError') {
        customError.statusCode = StatusCodes.BAD_REQUEST;
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
        customError.statusCode = StatusCodes.NOT_FOUND;
        customError.message = 'Nothing Found with the Information Provided!';
    }
    return res.status(customError.statusCode).json({msg: customError.message});
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
}

export default errorHandler;