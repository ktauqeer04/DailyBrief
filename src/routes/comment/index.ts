import { Router } from "express";
import authMiddleware from "../../middlewares/AuthMiddleware";
import { commentController } from "../../controllers/commentController";

const router = Router();


router.post('/', authMiddleware, commentController.commentPost)
router.post('/likes', authMiddleware, commentController.likes);


export default router;