"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const imgConfig_1 = require("../utils/imgConfig");
const db_1 = require("../db");
class ProfileController {
    // static async fetch(req: Request, res: Response){
    // }
    // static async store(req: Request, res: Response){
    // }
    static async show(req, res) {
        const { id } = req.params;
        const findUser = await db_1.prisma.people.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            res.status(404).json({
                error: "User not found"
            });
            return;
        }
        res.status(200).json({
            User: findUser
        });
        return;
    }
    static async remove(req, res) {
        const { id } = req.params;
        //@ts-ignore
        const tokenId = req.user.id;
        console.log(`Params Id ${id} and Token Id ${tokenId}`);
        if (tokenId != id) {
            res.status(400).json({
                error: "You are not Authorized to remove this account"
            });
            return;
        }
        const findUser = await db_1.prisma.people.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            res.status(404).json({
                error: "User not found"
            });
            return;
        }
        await db_1.prisma.people.delete({ where: { id: Number(id) } });
        res.status(200).json({
            message: "User deleted Successfully"
        });
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.files || Object.keys(req.files).length == 0) {
                res.status(400).json({
                    message: "Image is required for Profile Picture"
                });
                return;
            }
            const profile = req.files.profile;
            if (Array.isArray(profile)) {
                res.status(400).json({
                    error: "Only 1 Image is required"
                });
                return;
            }
            const imageFunction = (0, imgConfig_1.imageValidationAndUpload)(profile);
            if (!imageFunction.success) {
                res.status(400).json({
                    error: imageFunction.message
                });
                return;
            }
            await db_1.prisma.people.update({
                data: {
                    profile: imageFunction.message
                },
                where: {
                    id: Number(id)
                }
            });
            res.status(200).json({
                name: profile.name,
                size: profile?.size,
                mime: profile?.mimetype
            });
            return;
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.ProfileController = ProfileController;
