import {StatusCodes} from 'http-status-codes';
import CustomError from './custom-error';

class UnauthorizedError extends CustomError {
    statusCode: number = StatusCodes.UNAUTHORIZED;
    constructor(message: string) {
        super(message);
    }
}

export default UnauthorizedError;