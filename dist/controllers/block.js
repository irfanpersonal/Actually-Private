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
exports.unblockUser = exports.blockUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const models_1 = require("../models");
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id === req.user.userID) {
        throw new errors_1.default.BadRequestError('You cannot block yourself!');
    }
    const user = yield models_1.User.findOne({ _id: id });
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    // Check if you already blocked the provided user and if so throw an error
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (loggedInUser.blockedUsers.includes(id)) {
        throw new errors_1.default.BadRequestError('You already blocked this user!');
    }
    // Delete Any Follow Requests sent to the loggedInUser from the provided user
    yield models_1.FollowRequest.deleteMany({ to: req.user.userID, from: id });
    yield models_1.FollowRequest.deleteMany({ to: id, from: req.user.userID });
    // Update followers and following array 
    yield models_1.User.findOneAndUpdate({ _id: req.user.userID }, { $pull: { following: id, followers: id } });
    yield models_1.User.findOneAndUpdate({ _id: id }, { $pull: { followers: req.user.userID, following: req.user.userID } });
    // Block the provided user
    loggedInUser.blockedUsers.push(id);
    yield loggedInUser.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Blocked User!' });
});
exports.blockUser = blockUser;
const unblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id === req.user.userID) {
        throw new errors_1.default.BadRequestError('You cannot unblock yourself!');
    }
    const user = (yield models_1.User.findOne({ _id: id }));
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    const loggedInUser = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (!loggedInUser.blockedUsers.includes(id)) {
        throw new errors_1.default.BadRequestError(`You can't unblock someone you haven't blocked!`);
    }
    yield models_1.User.findOneAndUpdate({ _id: req.user.userID }, { $pull: { blockedUsers: id } });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Unblocked User!' });
});
exports.unblockUser = unblockUser;
