import { NextFunction, Request, Response } from "express";
import { ValidateRegister } from "../validations/errorHandling";
import bcrypt from "bcrypt";
import { prisma } from "../db";
import jwt from "jsonwebtoken";

class AuthController{

    static async register(req: Request, res: Response, next: NextFunction){

        try{

            const { name, email, password } = req.body;
            const validate = ValidateRegister({name, email, password});

            if(validate.isError){

                res.status(422).json({
                    error: validate.error
                })

            }else{
                
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                const findUser = await prisma.people.findFirst({
                    where:{
                        email
                    }
                })

                if(findUser){
                    res.status(422).json({
                        message: "User exists. please Login"
                    })
                    return;
                }

                const user = await prisma.people.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword
                    }
                })

                // console.log(user.id);
                const payload  = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile: user?.profile
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET || "");
        
                res.status(200).json({
                    message: "Register Successful",
                    token: `Bearer ${token}`
                })
                return;
                
            }

        }catch(error){
            res.status(500).json({
                message: "server error"
            })
            console.error(error);
        }

    }

    static async login(req: Request, res: Response, next: NextFunction){
        try{

            const {email, password} = req.body;
            // first verifying whether the email exists
            const findUser = await prisma.people.findFirst({
                where: {
                    email
                }
            })

            if(!findUser){
                res.status(404).json({
                    message:"User doesn't Exists. Please Register"
                })
                return;
            }

            // verify passsword

            const verify = await bcrypt.compare(password, findUser.password);

            if(!verify){
                res.status(404).json({
                    message:"Incorrect Password"
                })
                return;
            }

            //issue token to the user

            const payload  = {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                profile: findUser?.profile
            }
            
            // console.log(`secret is ${process.env.JWT_SECRET}`);
            
            const token = jwt.sign(payload, process.env.JWT_SECRET || "")

            res.status(200).json({
                message: "Login Successful",
                token: `Bearer ${token}`
            })
            return;

        }catch(error){
            res.status(500).json({
                message: "server error"
            })
            console.error(error);
        }
    }

}

export default AuthController;

