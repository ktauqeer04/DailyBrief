"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeController = void 0;
const db_1 = require("../db");
class SubscribeController {
    static async subscribe(req, res) {
        try {
            const { user_id, author_id, isSubscribe } = req.body;
            if (isSubscribe == true) {
                const subscribed = await db_1.prisma.subscription.create({
                    data: {
                        user_id: user_id,
                        author_id: author_id,
                    }
                });
                if (subscribed) {
                    res.status(200).json({
                        message: "Subscribed Successfully"
                    });
                    return;
                }
            }
            else {
                const deleteSubscription = await db_1.prisma.subscription.deleteMany({
                    where: {
                        user_id: user_id,
                        author_id: author_id
                    }
                });
                if (deleteSubscription) {
                    res.status(200).json({
                        message: "Unsubscribed Successfully from here"
                    });
                    return;
                }
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Internal Error"
            });
            throw new Error(`error is ${error}`);
        }
    }
}
exports.SubscribeController = SubscribeController;
