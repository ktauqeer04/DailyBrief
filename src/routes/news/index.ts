import authMiddleware from "../../middlewares/AuthMiddleware";
import { NewsController } from "../../controllers/NewsController";
import { Router } from "express";

const router = Router();

router.post('/post', authMiddleware, NewsController.store);
router.get('/fetch', NewsController.Fetch);
router.get('/fetch/:id', NewsController.show);
router.put('/update/:id', NewsController.update);
router.delete('/delete/:id', authMiddleware, NewsController.remove);
router.post('/save', authMiddleware, NewsController.SavePost);
router.get('/savedpost', authMiddleware, NewsController.getSavedPost)

export default router;