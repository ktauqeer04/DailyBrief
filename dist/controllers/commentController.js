"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = void 0;
const db_1 = require("../db");
class commentController {
    static async commentPost(req, res) {
        try {
            const { comment, post_id } = req.body;
            //@ts-ignore
            const { name } = req.user;
            const publish = await db_1.prisma.comment.create({
                data: {
                    post_id: post_id,
                    commenter_name: name,
                    comment_description: comment,
                    likes: 0
                }
            });
            res.status(200).json({
                message: "comment published successfully"
            });
            return;
        }
        catch (error) {
            res.status(500);
            console.error(error);
        }
    }
    static async likes(req, res) {
        try {
            const { upvote, id } = req.body;
            await db_1.prisma.comment.update({
                where: {
                    id: id
                },
                data: {
                    likes: {
                        increment: upvote ? 1 : -1,
                    }
                }
            });
            res.status(200).json({
                message: "comment upvoted successfully"
            });
        }
        catch (error) {
            res.status(500);
            console.error(error);
        }
    }
}
exports.commentController = commentController;
