"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS
    }
});
const sendVerificationEmail = async (to_email, token) => {
    try {
        const URL = process.env.RENDER_EXTERNAL_URL || process.env.DEV_URL;
        console.log(`URL is ${URL}`);
        if (!URL) {
            throw new Error('No valid URL found for the environment');
        }
        const verificationEmail = `${URL}/api/auth/verify-email?token=${token}`;
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: to_email,
            subject: 'Daily Brief',
            text: `Click the following link to verify your email: ${verificationEmail}`,
            html: `<p>Click <a href="${verificationEmail}">here</a> to verify your email.</p>`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`email sent to ${to_email}`);
    }
    catch (error) {
        throw new Error(`Error is ${error}`);
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendNotificationEmail = async (Emails, author_name, title, content) => {
    try {
        const contentOnEmail = (content.length > 100) ? content.substring(0, 99) : content;
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: Emails,
            subject: 'Daily Brief',
            text: `New Post from ${author_name}`,
            html: `<h2>${title}</h2>
                    <br>
                    <p>${contentOnEmail}</p>`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`email sent to ${Emails}`);
    }
    catch (error) {
        throw new Error(`Error is ${error}`);
    }
};
exports.sendNotificationEmail = sendNotificationEmail;
