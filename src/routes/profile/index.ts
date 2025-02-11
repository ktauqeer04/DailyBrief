import authMiddleware from "../../middlewares/AuthMiddleware";
import { ProfileController } from "../../controllers/profileController";
import { Router } from "express";

const router = Router();


router.put('/profile/:id', authMiddleware, ProfileController.update);
router.get('/profile/:id', authMiddleware, ProfileController.show);
router.delete('/profile/:id', authMiddleware, ProfileController.remove);

export default router;