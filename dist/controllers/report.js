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
exports.notifyUser = exports.getAllReports = exports.createReport = void 0;
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const models_1 = require("../models");
const node_path_1 = __importDefault(require("node:path"));
const cloudinary_1 = require("cloudinary");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (id === req.user.userID) {
        throw new errors_1.default.BadRequestError('You cannot create a report on yourself!');
    }
    const user = yield models_1.User.findOne({ _id: id });
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    const alreadyCreatedReport = yield models_1.Report.findOne({ from: req.user.userID, to: id });
    if (alreadyCreatedReport) {
        throw new errors_1.default.BadRequestError('You already reported this user!');
    }
    req.body.to = id;
    req.body.from = req.user.userID;
    req.body.image = '';
    const report = yield models_1.Report.create(req.body);
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.image) {
        const reportImage = req.files.image;
        if (!reportImage.mimetype.startsWith('image')) {
            throw new errors_1.default.BadRequestError('File must be an image!');
        }
        if (reportImage.size > 1000000 * 2) {
            throw new errors_1.default.BadRequestError('Image Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'report' + '_' + reportImage.name;
        const destination = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifier);
        yield reportImage.mv(destination);
        const result = yield cloudinary_1.v2.uploader.upload(destination, {
            public_id: uniqueIdentifier,
            folder: 'ACTUALLY-PRIVATE/REPORT_IMAGES'
        });
        yield (0, utils_1.deleteImage)(destination);
        report.image = result.secure_url;
        yield report.save();
    }
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: 'Successfully Created Report!' });
});
exports.createReport = createReport;
const getAllReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const queryObject = {};
    if (search) {
        const user = yield models_1.User.findOne({ name: search });
        if (user) {
            queryObject.from = user._id;
        }
        else {
            queryObject.from = req.user.userID;
        }
    }
    let result = models_1.Report.find(queryObject);
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const reports = yield result;
    const totalReports = yield models_1.Report.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalReports / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ reports, totalReports, numberOfPages });
});
exports.getAllReports = getAllReports;
const notifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) {
        throw new errors_1.default.BadRequestError('Please provide notification message!');
    }
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    const user = (yield models_1.User.findById({ _id: id }));
    if (user.role === 'admin') {
        throw new errors_1.default.BadRequestError('You cannot notify the admin user!');
    }
    const msg = {
        to: user.email,
        from: process.env.SENDGRID_VERIFIED_SENDER,
        subject: 'Actually Private - Message About Platform',
        text: message
    };
    yield mail_1.default.send(msg);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Notified User!' });
});
exports.notifyUser = notifyUser;
