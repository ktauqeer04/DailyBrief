"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const NewsController_1 = require("../../controllers/NewsController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/post', AuthMiddleware_1.default, NewsController_1.NewsController.store);
router.get('/fetch', NewsController_1.NewsController.Fetch);
router.get('/fetch/:id', NewsController_1.NewsController.show);
router.put('/update/:id', NewsController_1.NewsController.update);
router.delete('/delete/:id', AuthMiddleware_1.default, NewsController_1.NewsController.remove);
router.post('/save', AuthMiddleware_1.default, NewsController_1.NewsController.SavePost);
router.get('/savedpost', AuthMiddleware_1.default, NewsController_1.NewsController.getSavedPost);
exports.default = router;
