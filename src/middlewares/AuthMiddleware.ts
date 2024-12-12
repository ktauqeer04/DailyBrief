import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const AuthHeader = req.headers.authorization;
    if(AuthHeader === null || AuthHeader === undefined){
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    const token = AuthHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "", (error, user) => {
        if(error){
            res.status(401).json({
                message: "Unauthorized"
            })
        }
        next();
    })

;}

export default authMiddleware