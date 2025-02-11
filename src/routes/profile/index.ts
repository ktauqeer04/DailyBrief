import authMiddleware from "../../middlewares/AuthMiddleware";
import { ProfileController } from "../../controllers/profileController";
import { Router } from "express";

const router = Router();


router.put('/:id', authMiddleware, ProfileController.update);
router.get('/:id', authMiddleware, ProfileController.show);
router.delete('/:id', authMiddleware, ProfileController.remove);

export default router;