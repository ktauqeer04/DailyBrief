"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const errorHandling_1 = require("../utils/errorHandling");
const imgConfig_1 = require("../utils/imgConfig");
const db_1 = require("../db");
const newsTransform_1 = require("../transform/newsTransform");
class NewsController {
    static async Fetch(req, res) {
        try {
            const page = Number(req.query.page) <= 0 || !Number(req.query.page) ? 1 : Number(req.query.page);
            const limit = (Number(req.query.limit) <= 0 || Number(req.query.limit) > 100 || !Number(req.query.limit)) ? 10 : Number(req.query.limit);
            const skip = (page - 1) * limit;
            console.log(`page is ${page}, limit is ${limit}, skip is ${skip}`);
            const allNews = await db_1.prisma.news.findMany({
                skip: skip,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                },
                take: limit
            });
            const transformedNews = allNews.map((item) => newsTransform_1.NewsTransform.Transform(item));
            const totalNews = await db_1.prisma.people.count();
            const totalPages = Math.ceil(totalNews / limit);
            res.status(200).json({
                message: transformedNews,
                metaData: {
                    totalPages: totalPages,
                    currentPage: page,
                    limit: limit
                }
            });
            return;
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
            console.error(error);
        }
    }
    static async store(req, res) {
        try {
            const { title, content } = req.body;
            //@ts-ignore
            const userid = req.user.id;
            // console.log(`id is ${userid}`);
            console.log({ title, content });
            const validate = (0, errorHandling_1.ValidateNews)({ title, content });
            if (validate.isError) {
                res.status(400).json({
                    error: validate.error
                });
                return;
            }
            if (!req.files || Object.keys(req.files).length == 0) {
                res.status(422).json({
                    message: "Image is required"
                });
                return;
            }
            const image = req.files.image;
            if (Array.isArray(image)) {
                res.status(400).json({
                    error: "Only 1 Image is required"
                });
                return;
            }
            const imageFunction = (0, imgConfig_1.imageValidationAndUpload)(image);
            if (!imageFunction.success) {
                res.status(400).json({
                    error: imageFunction.message
                });
                return;
            }
            const news = await db_1.prisma.news.create({
                data: {
                    author_id: userid,
                    title,
                    content,
                    image: imageFunction.message
                }
            });
            res.status(200).json({
                news
            });
        }
        catch (error) {
            res.status(500);
            console.error(error);
            return;
        }
    }
    static async show(req, res) {
        try {
            const id = req.params.id;
            const news = await db_1.prisma.news.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            });
            if (!news) {
                res.status(404).json({
                    error: "Data not found"
                });
                return;
            }
            const updatedNews = newsTransform_1.NewsTransform.Transform(news);
            res.status(200).json({
                updatedNews
            });
            return;
        }
        catch (error) {
            res.status(500);
            console.error(error);
            return;
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            //@ts-ignore
            const userid = req.user.id;
            const news = await db_1.prisma.news.findFirst({
                where: {
                    id: Number(id),
                }
            });
            if (!news) {
                res.status(404).json({
                    error: "News not available, please provide a correct news Id"
                });
                return;
            }
            if (news?.author_id !== userid) {
                res.status(400).json({
                    error: "Unauthorized"
                });
                return;
            }
            //first image update
            //validate and upload the image first
            const image = req?.files?.image || null;
            const { title, content } = req.body;
            console.log(title, content, news.image);
            let imageName = news.image;
            if (image !== null) {
                if (Array.isArray(image) && image !== null) {
                    res.status(400).json({
                        error: "Only 1 Image is required"
                    });
                    return;
                }
                const imageFunction = (0, imgConfig_1.imageValidationAndUpload)(image);
                imageName = imageFunction.message;
                if (!imageFunction.success) {
                    res.status(400).json({
                        error: imageFunction.message
                    });
                    return;
                }
                // validation done
                // remove old image 
                console.log(news.image);
                (0, imgConfig_1.removeImage)(news.image);
            }
            const validate = (0, errorHandling_1.ValidateNews)({ title, content });
            if (validate.isError) {
                console.error(validate.error);
                return;
            }
            await db_1.prisma.news.update({
                where: {
                    id: news.id
                },
                data: {
                    title,
                    content,
                    image: imageName
                }
            });
            res.status(200).json({
                message: "Successfully updated"
            });
            return;
        }
        catch (error) {
            res.status(500);
            console.error(error);
        }
    }
    static async remove(req, res) {
        try {
            const { id } = req.params;
            //@ts-ignore
            const userid = req.user.id;
            const news = await db_1.prisma.news.findFirst({
                where: {
                    id: Number(id)
                }
            });
            if (!news) {
                res.status(404).json({
                    error: "News not available, please provide a correct news Id"
                });
                return;
            }
            if (news?.author_id !== userid) {
                res.status(400).json({
                    error: "Unauthorized"
                });
                return;
            }
            await db_1.prisma.news.delete({
                where: {
                    id: Number(id)
                }
            });
            res.status(200).json({
                message: `News of ${Number(id)} id deleted Successfully`
            });
        }
        catch (error) {
            res.status(500);
            console.error(error);
        }
    }
}
exports.NewsController = NewsController;
