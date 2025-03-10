"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const utils_1 = require("../utils/");
const db_1 = require("../db");
const newsTransform_1 = __importDefault(require("../transform/newsTransform"));
const newsService_1 = require("../service/newsService");
class NewsController {
    static async Fetch(req, res) {
        try {
            const page = Number(req.query.page) <= 0 || !Number(req.query.page) ? 1 : Number(req.query.page);
            const limit = 10;
            const skip = (page - 1) * limit;
            console.log(`page is ${page}, limit is ${limit}, skip is ${skip}`);
            const cacheKey = `news:page=${page}`;
            const cachedData = await utils_1.Queue.redis.get(cacheKey);
            if (cachedData) {
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
            const allNews = await (0, newsService_1.findAllNews)({
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
            if (!allNews || allNews.length == 0) {
                res.status(400).json({
                    message: "Cannot Fetch News"
                });
                return;
            }
            const transformedNews = allNews.map((item) => newsTransform_1.default.Transform(item));
            const totalNews = await db_1.prisma.people.count();
            const totalPages = Math.ceil(totalNews / limit);
            const cacheValue = JSON.stringify({ transformedNews, totalPages });
            await utils_1.Queue.redis.set(cacheKey, cacheValue, "EX", 420);
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
            console.log(req.body);
            //@ts-ignore
            const userid = req.user.id;
            const validate = utils_1.Validation.ValidateNews({ title, content });
            if (validate.isError) {
                console.log(validate.error);
                res.status(400).json({
                    error: validate.error,
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
            const imageFunction = await utils_1.ImageHelper.imageValidationAndUpload(image);
            if (!imageFunction.success) {
                res.status(400).json({
                    error: imageFunction.message,
                });
                return;
            }
            // clear cache 
            // const cacheKey = `news:page:${}`
            const news = await db_1.prisma.news.create({
                data: {
                    author_id: userid,
                    title,
                    content,
                    image: imageFunction.message
                }
            });
            const id = news.id;
            const page = Math.ceil(id / 10);
            const cacheKey = `news:page=${page}`;
            const cachedData = await utils_1.Queue.redis.get(cacheKey);
            if (cachedData) {
                await utils_1.Queue.redis.del(cacheKey);
                console.log(`Cache key deleted successfully`);
            }
            const Emails = await db_1.prisma.subscription.findMany({
                where: {
                    author_id: userid
                },
                include: {
                    user: {
                        select: {
                            email: true
                        }
                    }
                }
            });
            const EmailArray = [];
            Emails.map((data) => {
                EmailArray.push(data.user.email);
                // console.log(data.user.email);
            });
            //@ts-ignore
            // console.log(req.user.name);
            // console.log(Emails);
            await utils_1.Queue.notificationQueue.add('project01-news-notification', {
                title,
                content,
                //@ts-ignore
                author_name: req.user.name,
                Emails: EmailArray
            });
            res.status(200).json({
                message: "News Posted and emails have been sent to subscribers"
            });
            return;
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
            const news = await db_1.prisma.news.findFirst({
                where: {
                    id: Number(id)
                },
                select: {
                    id: true,
                    title: true,
                    image: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            });
            const comments = await (0, newsService_1.findAllNews)({
                where: {
                    post_id: Number(id)
                },
                orderBy: [
                    {
                        likes: 'desc'
                    }
                ],
                take: 50,
                select: {
                    commenter_name: true,
                    comment_description: true
                }
            });
            if (!news) {
                res.status(404).json({
                    error: "Data not found"
                });
                return;
            }
            const News = newsTransform_1.default.Transform(news);
            res.status(200).json({
                News,
                comments: comments == null ? 0 : comments
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
                const imageFunction = await utils_1.ImageHelper.imageValidationAndUpload(image);
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
                utils_1.ImageHelper.removeImage(news.image);
            }
            const validate = utils_1.Validation.ValidateNews({ title, content });
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
            const page = Math.ceil(news.id / 10);
            const cacheKey = `news:page=${page}`;
            const cachedData = await utils_1.Queue.redis.get(cacheKey);
            if (cachedData) {
                await utils_1.Queue.redis.del(cacheKey);
                console.log(`Cache key deleted successfully`);
            }
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
    //delete post
    static async remove(req, res) {
        try {
            const { id } = req.params;
            //@ts-ignore
            const userid = req.user.id;
            const news = await (0, newsService_1.findById)({
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
            return;
        }
        catch (error) {
            res.status(500);
            console.error(error);
        }
    }
    // hit api end point to save post
    static async SavePost(req, res) {
        try {
            const { postId } = req.body;
            //@ts-ignore
            const { id } = req.user;
            await db_1.prisma.savePost.create({
                data: {
                    post_id: Number(postId),
                    user_id: Number(id)
                }
            });
            res.status(200).json({
                message: "Post saved Succcessfully"
            });
            return;
        }
        catch (error) {
            res.status(500);
            console.error(error);
        }
    }
    //hit api end point to get all the saved post
    static async getSavedPost(req, res) {
        try {
            //@ts-ignore
            const { id } = req.user;
            const firstTenPost = await (0, newsService_1.findAllNews)({
                where: {
                    user_id: id
                },
                include: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            image: true,
                            created_at: true,
                        },
                    }
                },
                orderBy: {
                    created_at: 'desc',
                },
                take: 10,
            });
            res.status(200).json({
                firstTenPost
            });
            return;
        }
        catch (error) {
            res.status(500);
            console.error(error);
        }
    }
}
exports.NewsController = NewsController;
