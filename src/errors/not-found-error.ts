import {StatusCodes} from 'http-status-codes';
import CustomError from './custom-error';

class NotFoundError extends CustomError {
    statusCode: number = StatusCodes.NOT_FOUND;
    constructor(message: string) {
        super(message);
    }
}

export default NotFoundError;