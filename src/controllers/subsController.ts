import { Request, Response } from "express";
import { prisma } from "../db";


export class SubscribeController{

    static async subscribe(req: Request, res: Response){

        try {

            const {user_id, author_id, isSubscribe} = req.body;

            if(isSubscribe == true){
                const subscribed = await prisma.subscription.create({
                    data:{
                        user_id: user_id,
                        author_id: author_id,
                    }
                })
    
                if(subscribed){
                    res.status(200).json({
                        message: "Subscribed Successfully"
                    })
                    return;
                }
    
            }else{
                const deleteSubscription = await prisma.subscription.deleteMany({
                    where: {
                        user_id: user_id,
                        author_id: author_id
                    }
                })
                if(deleteSubscription){
                    res.status(200).json({
                        message: "Unsubscribed Successfully from here"
                    })
                    return;
                }
            }

        } catch (error) {
            
            res.status(500).json({
                message: "Internal Error"
            });
            throw new Error(`error is ${error}`);

        }


    }
}