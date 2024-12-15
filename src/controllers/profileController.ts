import { NextFunction, Request, Response } from "express";
import { imageValidation } from "../utils/imgConfig";
import { prisma } from "../db";

export class ProfileController{

    static async index(req: Request, res: Response){

    }

    static async store(req: Request, res: Response){

    }

    static async fetch(req: Request, res: Response){

    }

    static async remove(req: Request, res: Response){
        
    }

    static async update(req: Request, res: Response, next: NextFunction){

        try{
            const { id } = req.params;

            if(!req.files || Object.keys(req.files).length == 0){
                res.status(400).json({
                    message: "Image is required for Profile Picture"
                })
                return;
            }

            const profile = req.files.profile;

            if (Array.isArray(profile)) {
                res.status(400).json({
                    error: "Only 1 Image is required"
                })
                return;
            }
            
            const imageFunction = imageValidation(profile);

            if(!imageFunction.success){
                res.status(400).json({
                    error: imageFunction.message
                })
                return;
            }

            await prisma.people.update({
                data: {
                    profile: imageFunction.message
                },
                where: {
                    id: Number(id)
                }
            })

            res.status(200).json({
                name: profile.name,
                size: profile?.size,
                mime: profile?.mimetype 
            })
            return;

        }catch(error){
            console.error(error);
        }
    }

}

