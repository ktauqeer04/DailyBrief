import { Request, Response } from "express";
import { Validation, Queue } from "../utils";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUser, registerUser, updateUser } from "../service/authService";

class AuthController{

    static async register(req: Request, res: Response){

        try{

            const { name, email, password } = req.body;
            const validate = Validation.ValidateRegister({ name, email, password });

            if(validate.isError){

                res.status(422).json({
                    error: validate.error
                })
                return;

            }else{
                
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                const findIfUserExists = await findUser({ email });

                if(findIfUserExists){
                    res.status(422).json({
                        message: "Email already exists. please Login"
                    })
                    return;
                }

                const user = await registerUser({ name, email, password: hashedPassword });

                if (!user) {
                    throw new Error("User registration failed"); 
                }
                
                // console.log(user.id);
                const payload  = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile: user?.profile
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET || "");
                
                console.log(`before email worker`);
                
                await Queue.emailQueue.add('project01-verify-email', {
                    email: email,
                    token: token
                })
                
                const id = user.id;
                await updateUser({ 
                    where: {
                        id: id
                    }, 
                    data: {
                        verification_token : token
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
            const findIfUserExists = await findUser({ email, is_verified: true});

            if(!findIfUserExists){
                res.status(404).json({
                    message:"User doesn't Exists. Please Register"
                })
                return;
            }

            // verify passsword

            const verify = await bcrypt.compare(password, findIfUserExists.password);

            if(!verify){
                res.status(404).json({
                    message:"Incorrect Password"
                })
                return;
            }

            //issue token to the user

            const payload  = {
                id: findIfUserExists.id,
                name: findIfUserExists.name,
                email: findIfUserExists.email,
                profile: findIfUserExists?.profile
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
            const user = await findUser({ email });

            if (!user || user.verification_token !== token) {
                return res.status(400).json({ error: 'Invalid or expired token.' });
            }

            const update = await updateUser({ 

                where: {
                    email: email
                }, 
                data: {
                    is_verified: true, verification_token: null
                }

            });

            if(!update){
                res.status(400).json({ message: 'Something went wrong, please try again later....' });
            }
          
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

