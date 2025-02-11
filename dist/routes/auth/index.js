"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../../controllers/authController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/auth/register', authController_1.default.register);
router.post('/auth/login', authController_1.default.login);
router.get('/auth/verify-email', authController_1.default.verifyEmail);
exports.default = router;
