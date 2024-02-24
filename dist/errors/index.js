"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_1 = __importDefault(require("./custom-error"));
const bad_request_error_1 = __importDefault(require("./bad-request-error"));
const not_found_error_1 = __importDefault(require("./not-found-error"));
const unauthorized_error_1 = __importDefault(require("./unauthorized-error"));
const forbidden_error_1 = __importDefault(require("./forbidden-error"));
exports.default = {
    CustomError: custom_error_1.default,
    BadRequestError: bad_request_error_1.default,
    NotFoundError: not_found_error_1.default,
    UnauthorizedError: unauthorized_error_1.default,
    ForbiddenError: forbidden_error_1.default
};
