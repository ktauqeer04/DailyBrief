"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const profileController_1 = require("../../controllers/profileController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.put('/:id', AuthMiddleware_1.default, profileController_1.ProfileController.update);
router.get('/:id', AuthMiddleware_1.default, profileController_1.ProfileController.show);
router.delete('/:id', AuthMiddleware_1.default, profileController_1.ProfileController.remove);
exports.default = router;
