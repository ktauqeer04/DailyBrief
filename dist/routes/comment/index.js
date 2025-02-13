"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const commentController_1 = require("../../controllers/commentController");
const router = (0, express_1.Router)();
router.post('/', AuthMiddleware_1.default, commentController_1.commentController.commentPost);
router.post('/likes', AuthMiddleware_1.default, commentController_1.commentController.likes);
exports.default = router;
