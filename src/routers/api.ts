import * as express from "express";
import {Response, Request } from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middlewares/AuthMiddleware"
import { ProfileController } from "../controllers/profileController";
import { NewsController } from "../controllers/NewsController";
// import {ProfileController} from "../controllers/profileController";

const router = express.Router();


router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/verify-email', AuthController.verifyEmail as (req: Request, res: Response) => Promise<void>);

//profile Routes
router.put('/profile/:id', authMiddleware, ProfileController.update);
router.get('/profile/:id', authMiddleware, ProfileController.show);
router.delete('/profile/:id', authMiddleware, ProfileController.remove);

// news routes
router.post('/news/post', authMiddleware, NewsController.store);
router.get('/news/fetch', NewsController.Fetch);
router.get('/news/fetch/:id', authMiddleware, NewsController.show);
router.put('/news/update/:id', authMiddleware, NewsController.update)
router.delete('/news/delete/:id', authMiddleware, NewsController.remove)

export default router;

