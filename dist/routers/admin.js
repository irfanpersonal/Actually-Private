"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const admin_1 = require("../controllers/admin");
const authentication_1 = require("../middleware/authentication");
router.route('/stats').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), admin_1.getStats);
exports.default = router;
