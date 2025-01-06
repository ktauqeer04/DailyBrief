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

    try{

        const URL = process.env.RENDER_EXTERNAL_URL || process.env.DEV_URL;
        if (!URL) {
            throw new Error('No valid URL found for the environment');
        }
        const verificationEmail = `${URL}/api/auth/verify-email?token=${token}`;
    
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: to_email,
            subject: 'Verify Your Email Address',
            text: `Click the following link to verify your email: ${verificationEmail}`,
            html: `<p>Click <a href="${verificationEmail}">here</a> to verify your email.</p>`,
        }
    
        await transporter.sendMail(mailOptions);

        console.log(`email sent to ${to_email}`);

    }catch(error){

        console.error(error);

    }

}