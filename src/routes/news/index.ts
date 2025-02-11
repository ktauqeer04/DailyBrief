import authMiddleware from "../../middlewares/AuthMiddleware";
import { NewsController } from "../../controllers/NewsController";
import { Router } from "express";

const router = Router();

router.post('/news/post', authMiddleware, NewsController.store);
router.get('/news/fetch', NewsController.Fetch);
router.get('/news/fetch/:id', NewsController.show);
router.put('/news/update/:id', NewsController.update);
router.delete('/news/delete/:id', authMiddleware, NewsController.remove);
router.post('/news/save', authMiddleware, NewsController.SavePost);
router.get('/news/savedpost', authMiddleware, NewsController.getSavedPost)

export default router;