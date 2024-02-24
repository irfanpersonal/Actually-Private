import {StatusCodes} from 'http-status-codes';
import CustomError from './custom-error';

class BadRequestError extends CustomError {
    statusCode: number = StatusCodes.BAD_REQUEST;
    constructor(message: string) {
        super(message);
    }
}

export default BadRequestError;