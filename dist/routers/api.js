"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const profileController_1 = require("../controllers/profileController");
const NewsController_1 = require("../controllers/NewsController");
const subsController_1 = require("../controllers/subsController");
const commentController_1 = require("../controllers/commentController");
// import {ProfileController} from "../controllers/profileController";
const router = express.Router();
router.post('/auth/register', authController_1.default.register);
router.post('/auth/login', authController_1.default.login);
router.get('/auth/verify-email', authController_1.default.verifyEmail);
//profile Routes
router.put('/profile/:id', AuthMiddleware_1.default, profileController_1.ProfileController.update);
router.get('/profile/:id', AuthMiddleware_1.default, profileController_1.ProfileController.show);
router.delete('/profile/:id', AuthMiddleware_1.default, profileController_1.ProfileController.remove);
// news routes
router.post('/news/post', AuthMiddleware_1.default, NewsController_1.NewsController.store);
router.get('/news/fetch', NewsController_1.NewsController.Fetch);
router.get('/news/fetch/:id', AuthMiddleware_1.default, NewsController_1.NewsController.show);
router.put('/news/update/:id', AuthMiddleware_1.default, NewsController_1.NewsController.update);
router.delete('/news/delete/:id', AuthMiddleware_1.default, NewsController_1.NewsController.remove);
// subscribe route
router.post('/v1/subscribe', AuthMiddleware_1.default, subsController_1.SubscribeController.subscribe);
//comment route
router.post('/news/comment', AuthMiddleware_1.default, commentController_1.commentController.commentPost);
router.post('/news/comment/likes', AuthMiddleware_1.default, commentController_1.commentController.likes);
exports.default = router;
