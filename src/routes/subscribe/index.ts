import authMiddleware from "../../middlewares/AuthMiddleware";
import { SubscribeController } from "../../controllers/subsController";
import { Router } from "express";


const router = Router();

router.post('/subscribe', authMiddleware, SubscribeController.subscribe);


export default router;