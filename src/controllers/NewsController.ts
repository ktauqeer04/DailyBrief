import { Request, Response } from "express";
import { ValidateNews } from "../utils/errorHandling";
import { imageValidationAndUpload, removeImage } from "../utils/imgConfig";
import { prisma } from "../db";
import { News, NewsTransform } from "../transform/newsTransform";
import { redis } from "../queue/worker"

export class NewsController{

    static async Fetch(req: Request, res: Response){

        try {

            const page = Number(req.query.page) <= 0 || !Number(req.query.page) ? 1 : Number(req.query.page);
            const limit = 10
            const skip = (page - 1) * limit;
            console.log(`page is ${page}, limit is ${limit}, skip is ${skip}`);
            
            const cacheKey = `news:page=${page}`

            const cachedData = await redis.get(cacheKey);

            if(cachedData){
                console.log("Serving from cache");
                const { transformedNews, totalPages } = JSON.parse(cachedData);

                res.status(200).json({
                    message: transformedNews,
                    metaData: {
                        totalPages: totalPages,
                        currentPage: page,
                        limit: limit,
                    },
                });
                return;
            }

            const allNews = await prisma.news.findMany({
                skip: skip,
                include:{
                    author: {
                        select:{
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                },
                take: limit
            });
    
            const transformedNews = allNews.map((item : News) => NewsTransform.Transform(item));

            const totalNews = await prisma.people.count();
            const totalPages = Math.ceil(totalNews / limit);

            const cacheValue = JSON.stringify({ transformedNews, totalPages });
            await redis.set(cacheKey, cacheValue, "EX", 420); 


    
            res.status(200).json({
                message: transformedNews,
                metaData: {
                    totalPages: totalPages,
                    currentPage: page,
                    limit: limit 
                }
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
            
            if(validate.isError){
                res.status(400).json({
                    error: validate.error
                })
                return;
            }

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

            const imageFunction = imageValidationAndUpload(image);

            if(!imageFunction.success){
                res.status(400).json({
                    error: imageFunction.message
                })
                return;
            }

            // clear cache 
            // const cacheKey = `news:page:${}`


            const news = await prisma.news.create({
                data: {
                    author_id: userid,
                    title,
                    content,
                    image: imageFunction.message
                }
            })

            
            const id = news.id;
            const page = Math.ceil(id/10);

            const cacheKey = `news:page=${page}`;
            const cachedData = await redis.get(cacheKey);

            if(cachedData){
                await redis.del(cacheKey);
                console.log(`Cache key deleted successfully`);
            }


            res.status(200).json({
                news
            })
            

        }catch(error){
            res.status(500)
            console.error(error);   
            return;
        }


    }
    
    static async show(req: Request, res: Response){
        try {
            const id = req.params.id;
            const news = await prisma.news.findUnique({
                where:{
                    id: Number(id)
                },
                include:{
                    author:{
                        select:{
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            })
        
            if(!news){
                res.status(404).json({
                    error: "Data not found"
                })
                return;
            }

            const updatedNews = NewsTransform.Transform(news);
        
            res.status(200).json({
                updatedNews
            })
            return;
        } catch (error) {
            res.status(500);
            console.error(error);
            return;
        }
    }
 
    static async update(req: Request, res: Response){

        try {
            const { id } = req.params;
            //@ts-ignore
            const userid = req.user.id;

            const news = await prisma.news.findFirst({
                where: {
                    id: Number(id),
                }
            })

            if(!news){
                res.status(404).json({
                    error: "News not available, please provide a correct news Id"
                });
                return;
            }

            if(news?.author_id !== userid){
                res.status(400).json({
                    error: "Unauthorized"
                })
                return;
            }

            //first image update
            //validate and upload the image first

            const image = req?.files?.image || null;
            const { title, content } = req.body;
            console.log(title, content, news.image);
            
            let imageName = news.image; 

            if(image !== null){

                if (Array.isArray(image) && image !== null) {
                    res.status(400).json({
                        error: "Only 1 Image is required"
                    })
                    return;
                }

                const imageFunction = imageValidationAndUpload(image);
                imageName = imageFunction.message

                if(!imageFunction.success){
                    res.status(400).json({
                        error: imageFunction.message
                    })
                    return;
                }

                // validation done
                // remove old image 
                console.log(news.image);
                removeImage(news.image);

            }
            
            const validate = ValidateNews({title, content});

            if(validate.isError){
                console.error(validate.error);
                return;
            } 

            await prisma.news.update({
                where:{
                    id: news.id
                },
                data:{
                    title,
                    content,
                    image: imageName
                }
            });

            const page = Math.ceil(news.id/10);
            const cacheKey = `news:page=${page}`;
            const cachedData = await redis.get(cacheKey);

            if(cachedData){
                await redis.del(cacheKey);
                console.log(`Cache key deleted successfully`);
            }

            res.status(200).json({
                message: "Successfully updated"
            })   
            return;

        } catch (error) {
            res.status(500);
            console.error(error);
        }

    }

    static async remove(req: Request, res: Response){
        try {
            const { id } = req.params;

            //@ts-ignore
            const userid = req.user.id;

            const news = await prisma.news.findFirst({
                where:{
                    id: Number(id)
                }
            })

            if(!news){
                res.status(404).json({
                    error: "News not available, please provide a correct news Id"
                });
                return;
            }

            if(news?.author_id !== userid){
                res.status(400).json({
                    error: "Unauthorized"
                })
                return;
            }

            await prisma.news.delete({
                where:{
                    id: Number(id)
                }
            })

            res.status(200).json({
                message: `News of ${Number(id)} id deleted Successfully`
            })
        } catch (error) {
            res.status(500);
            console.error(error);
        }
    }
}

