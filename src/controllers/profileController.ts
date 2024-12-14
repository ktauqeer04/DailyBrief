import { NextFunction, Request, Response } from "express";
import { generateRandomNumber, imageValidator } from "../validations/imgValidation";
import { UploadedFile } from "express-fileupload";
import { prisma } from "../db";
import path from "path";

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
                    message: "Only one profile picture is allowed"
                });
                return;
            }

            const message = imageValidator((profile.size), profile.mimetype);

            if(message !== null){
                res.status(400).json({
                    error: message
                })
                return;
            }
            
            const imgName = profile.name;
            const extension = imgName.split(".");
            const newImageName = generateRandomNumber() + "." + extension[1];

            const uploadPath = path.join(process.cwd(), 'src', 'public', 'images', newImageName);


            console.log(uploadPath);


            profile.mv(uploadPath, (error) => {
                console.error(error);
            })

            await prisma.people.update({
                data: {
                    profile: newImageName
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

