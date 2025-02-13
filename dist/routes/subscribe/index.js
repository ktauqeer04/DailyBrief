"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const subsController_1 = require("../../controllers/subsController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/subscribe', AuthMiddleware_1.default, subsController_1.SubscribeController.subscribe);
exports.default = router;
