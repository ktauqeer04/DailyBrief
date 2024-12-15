import { Request, Response } from "express";
import { ValidateNews } from "../utils/errorHandling";
import { imageValidation } from "../utils/imgConfig";
import { prisma } from "../db";
import { NewsTransform } from "../transform/newsTransform";

export class NewsController{

    static async Fetch(req: Request, res: Response){

        try {
            const allNews = await prisma.news.findMany({
                include:{
                    author: {
                        select:{
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            });
    
            const transformedNews = allNews.map((item) => NewsTransform.Transform(item));
    
            res.status(200).json({
                message: transformedNews,
            });

            return;

        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
            console.error(error);
        }
    

    }
    
    static async store(req: Request, res: Response){

        try{
            const {title, content} = req.body;
            //@ts-ignore
            const userid = req.user.id;
            // console.log(`id is ${userid}`);
            
            console.log({title, content});
            
            const validate = ValidateNews({title, content});

            if(!req.files || Object.keys(req.files).length == 0){
                res.status(422).json({
                    message: "Image is required"
                })
                return;
            }

            const image = req.files.image;

            if (Array.isArray(image)) {
                res.status(400).json({
                    error: "Only 1 Image is required"
                })
                return;
            }

            const imageFunction = imageValidation(image);

            if(!imageFunction.success){
                res.status(400).json({
                    error: imageFunction.message
                })
                return;
            }

            const news = await prisma.news.create({
                data: {
                    author_id: userid,
                    title,
                    content,
                    image: imageFunction.message
                }
            })


            res.status(200).json({
                news
            })


        }catch(error){
            res.status(500).json({
                message: error
            })
            return;
        }


    }
    
    static async fetch(req: Request, res: Response){
    
    }
    
    static async remove(req: Request, res: Response){
            
    }

    static async update(req: Request, res: Response){
            
    }
}

