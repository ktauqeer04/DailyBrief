import * as express from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middlewares/AuthMiddleware"
import { ProfileController } from "../controllers/profileController";
import { NewsController } from "../controllers/NewsController";
// import {ProfileController} from "../controllers/profileController";

const router = express.Router();


router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.put('/profile/:id', authMiddleware, ProfileController.update);

// news routes
router.post('/news/post', authMiddleware, NewsController.store);
router.get('/news/fetch', authMiddleware, NewsController.Fetch);

export default router;

