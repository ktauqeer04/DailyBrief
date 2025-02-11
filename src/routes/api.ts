import * as express from "express";
import authRouter from "./auth";
import commentRouter from "./comment";
import newsRouter from "./news";
import profileRouter from "./profile";
import subscribeRouter from "./subscribe";

// import {ProfileController} from "../controllers/profileController";

const router = express.Router();

//auth Routes
router.use('/auth', authRouter);

//profie
// news routes

// subscribe route

//comment route



export default router;

