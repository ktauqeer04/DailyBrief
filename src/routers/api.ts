import * as express from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middlewares/AuthMiddleware"

const router = express.Router();


router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

export default router;