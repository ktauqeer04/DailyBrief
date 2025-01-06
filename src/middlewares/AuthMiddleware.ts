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

    const decode = jwt.verify(token, process.env.JWT_SECRET || "", (error, user: any) => {
        if(error){
            res.status(401).json({
                message: "Unauthorized"
            })
        }        

        console.log(`this is user's email -> ${user.email}`);
        
        //@ts-ignore
        req.user = user;
        // console.log(req.user);

    })
    
    next();

;}

export default authMiddleware