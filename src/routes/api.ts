import * as express from "express";
import authRouter from "./auth";
import commentRouter from "./comment";
import newsRouter from "./news";
import profileRouter from "./profile";
import subscribeRouter from "./subscribe";

const router = express.Router();

//auth Routes
router.use('/auth', authRouter);

//profie routes
router.use('/profile', profileRouter);

// news routes
router.use('/news', newsRouter);

// subscribe route
router.use('/v1', subscribeRouter);

//comment route
router.use('/news/comment', commentRouter);


export default router;

