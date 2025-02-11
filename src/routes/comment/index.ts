import { Router } from "express";
import authMiddleware from "../../middlewares/AuthMiddleware";
import { commentController } from "../../controllers/commentController";

const router = Router();


router.post('/news/comment', authMiddleware, commentController.commentPost)
router.post('/news/comment/likes', authMiddleware, commentController.likes);


export default router;