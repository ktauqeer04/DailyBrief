import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS
    }
})

export const sendVerificationEmail = async (to_email : string, token : string) => {

    const URL = process.env.PROD_URL ? process.env.PROD_URL : process.env.DEV_URL;
    const verificationEmail = `${URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: to_email,
        subject: 'Verify Your Email Address',
        text: `Click the following link to verify your email: ${verificationEmail}`,
        html: `<p>Click <a href="${verificationEmail}">here</a> to verify your email.</p>`,
    }

    await transporter.sendMail(mailOptions);

}


