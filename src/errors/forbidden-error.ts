import {StatusCodes} from 'http-status-codes';
import CustomError from './custom-error';

class ForbiddenError extends CustomError {
    statusCode: number = StatusCodes.FORBIDDEN;
    constructor(message: string) {
        super(message);
    }
}

export default ForbiddenError;