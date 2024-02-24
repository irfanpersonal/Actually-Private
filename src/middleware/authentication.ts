import {Request, Response, NextFunction} from 'express';
import {verifyToken, ITokenPayload} from '../utils';
import CustomError from '../errors';

interface IRequest extends Request {
    user?: ITokenPayload
}

const authentication = (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.signedCookies.token;
        if (!token) {
            throw new CustomError.UnauthorizedError('Missing Token');
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(error) {
        throw new CustomError.UnauthorizedError('Failed to Authenticate User');
    }
}

const restrictFunctionalityTo = (...roles: string[]) => {
    return async(req: IRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user!.role)) {
            throw new CustomError.ForbiddenError('Access Forbidden!');
        }
        next();
    }
} 

export {
    authentication,
    restrictFunctionalityTo
};