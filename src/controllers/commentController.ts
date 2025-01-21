import { Request, Response } from "express";
import { prisma } from "../db";

export class commentController{

    static async commentPost(req: Request, res: Response){

        try {
            const { comment, post_id } = req.body;
            //@ts-ignore
            const {name} = req.user;

            const publish = await prisma.comment.create({
                data:{
                    post_id: post_id,
                    commenter_name: name,
                    comment_description: comment,
                    likes: 0
                }
            })   

            res.status(200).json({
                message: "comment published successfully"
            })

            return;
        } catch (error) {
            res.status(500);
            console.error(error);
        }

    }

    static async likes(req: Request, res: Response){

        try {

            const {upvote, id} = req.body;
            await prisma.comment.update({
                where: {
                    id: id
                },
                data:{
                    likes: {
                        increment: upvote ? 1 : -1,
                    }
                }
            })

            res.status(200).json({
                message: "comment upvoted successfully"
            })
            
        } catch (error) {
            res.status(500);
            console.error(error);
        }

    }

}