import jwt from 'jsonwebtoken';
import {IUser} from '../models/User';
import {Response} from 'express';
import fs from 'node:fs';

export interface ITokenPayload {
    userID: string,
    name: string,
    email: string,
    role: 'user' | 'admin'
}

const createToken = (user: IUser) => {
    const payload: ITokenPayload = {
        userID: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {expiresIn: process.env.JWT_LIFETIME as string}
    );
}

const createCookieWithToken = (res: Response, token: string) => {
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
}

const verifyToken = (token: string) => {
    return (jwt.verify(token, process.env.JWT_SECRET as string) as ITokenPayload);
}

const deleteFile = async(path: string) => {
    await fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? hours + ' hours ' : ''}${minutes > 0 ? minutes + ' minutes ' : ''}${remainingSeconds} seconds`;
}

export {
    createToken,
    createCookieWithToken,
    verifyToken,
    deleteFile,
    formatDuration
};