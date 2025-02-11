import AuthController from "../../controllers/authController";
import { Router, Request, Response } from "express";
const router = Router();


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verify-email', AuthController.verifyEmail as (req: Request, res: Response) => Promise<void>);

export default router