"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../service/authService");
class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const validate = utils_1.Validation.ValidateRegister({ name, email, password });
            if (validate.isError) {
                res.status(422).json({
                    error: validate.error
                });
                return;
            }
            else {
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                const findIfUserExists = await (0, authService_1.findUser)({ email });
                if (findIfUserExists) {
                    res.status(422).json({
                        message: "Email already exists. please Login"
                    });
                    return;
                }
                const user = await (0, authService_1.registerUser)({ name, email, password: hashedPassword });
                if (!user) {
                    throw new Error("User registration failed");
                }
                // console.log(user.id);
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile: user?.profile
                };
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "");
                console.log(`before email worker`);
                await utils_1.Queue.emailQueue.add('project01-verify-email', {
                    email: email,
                    token: token
                });
                const id = user.id;
                await (0, authService_1.updateUser)({
                    where: {
                        id: id
                    },
                    data: {
                        verification_token: token
                    }
                });
                res.status(200).json({
                    message: "Email sent Successfully",
                    token: `Bearer ${token}`
                });
                return;
            }
        }
        catch (error) {
            res.status(500).json({
                message: "server error"
            });
            console.error(error);
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // first verifying whether the email exists
            const findIfUserExists = await (0, authService_1.findUser)({ email, is_verified: true });
            if (!findIfUserExists) {
                res.status(404).json({
                    message: "User doesn't Exists. Please Register"
                });
                return;
            }
            // verify passsword
            const verify = await bcrypt_1.default.compare(password, findIfUserExists.password);
            if (!verify) {
                res.status(404).json({
                    message: "Incorrect Password"
                });
                return;
            }
            //issue token to the user
            const payload = {
                id: findIfUserExists.id,
                name: findIfUserExists.name,
                email: findIfUserExists.email,
                profile: findIfUserExists?.profile
            };
            // console.log(`secret is ${process.env.JWT_SECRET}`);
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "");
            res.status(200).json({
                message: "Login Successful",
                token: `Bearer ${token}`
            });
            return;
        }
        catch (error) {
            res.status(500).json({
                message: "server error"
            });
            console.error(error);
        }
    }
    static async verifyEmail(req, res) {
        const token = String(req.query.token);
        try {
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            const email = decode.email;
            const user = await (0, authService_1.findUser)({ email });
            if (!user || user.verification_token !== token) {
                return res.status(400).json({ error: 'Invalid or expired token.' });
            }
            const update = await (0, authService_1.updateUser)({
                where: {
                    email: email
                },
                data: {
                    is_verified: true, verification_token: null
                }
            });
            if (!update) {
                res.status(400).json({ message: 'Something went wrong, please try again later....' });
            }
            res.status(200).json({ message: 'Email verified successfully.' });
        }
        catch (error) {
            res.status(500).json({
                error: "Internal Server Error"
            });
            console.error(error);
        }
    }
}
exports.default = AuthController;
