"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictFunctionalityTo = exports.authentication = void 0;
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const authentication = (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        if (!token) {
            throw new errors_1.default.UnauthorizedError('Missing Token');
        }
        const decoded = (0, utils_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        throw new errors_1.default.UnauthorizedError('Failed to Authenticate User');
    }
};
exports.authentication = authentication;
const restrictFunctionalityTo = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!roles.includes(req.user.role)) {
            throw new errors_1.default.ForbiddenError('Access Forbidden!');
        }
        next();
    });
};
exports.restrictFunctionalityTo = restrictFunctionalityTo;
