import { Request, Response } from "express";
import { ValidateRegister } from "../utils/errorHandling";
import bcrypt from "bcrypt";
import { prisma } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { emailQueue } from "../queue/worker"

class AuthController{

    static async register(req: Request, res: Response){

        try{

            const { name, email, password } = req.body;
            const validate = ValidateRegister({name, email, password});

            if(validate.isError){

                res.status(422).json({
                    error: validate.error
                })
                return;

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
                        message: "Email already exists. please Login"
                    })
                    return;
                }

                const user = await prisma.people.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
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
                
                console.log(`before email worker`);
                
                await emailQueue.add('project01-verify-email', {
                    email: email,
                    token: token
                })

                await prisma.people.update({
                    where: { id: user.id },
                    data: {
                        verification_token: token
                    }
                });

        
                res.status(200).json({
                    message: "Email sent Successfully",
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

    static async login(req: Request, res: Response){
        try{

            const {email, password} = req.body;
            // first verifying whether the email exists
            const findUser = await prisma.people.findFirst({
                where: {
                    email,
                    is_verified: true
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


    static async verifyEmail(req: Request,  res: Response){

        const token  = String(req.query.token);

        try{

            const decode = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
            const email = decode.email;            
            const user = await prisma.people.findFirst({where:{email}});

            if (!user || user.verification_token !== token) {
                return res.status(400).json({ error: 'Invalid or expired token.' });
            }

            await prisma.people.update({
                where: { email },
                data: {
                  is_verified: true,
                  verification_token: null,
                },
              });
          
              res.status(200).json({ message: 'Email verified successfully.' });

        }catch(error){
            res.status(500).json({
                error: "Internal Server Error"
            })

            console.error(error);
            
        }

    }

}

export default AuthController;

