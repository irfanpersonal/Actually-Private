"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const notFound = (req, res) => {
    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send('<h1>NOT FOUND</h1>');
};
exports.default = notFound;
