import { Worker } from "bullmq";
import * as dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/emailConfig";
dotenv.config();
import { Queue } from "bullmq";


export const emailQueue = new Queue('project01-verify-email', {
    connection:{
        host: '127.0.0.1',
        port: 6379
    }
});


const emailWorker = new Worker('project01-verify-email', async (job) => {

    const { email, token } = job.data;
    
    await new Promise((resolve) => {
        console.log("the email worker data is", job.data);
        setTimeout(resolve, 4000)
    });

    await sendVerificationEmail(email, token);
    
},{
    connection: {
        host: '127.0.0.1',
        port: 6379
    }
})

emailWorker.on('completed', (job) => {
    console.log(`email is sent to ${job.data.email}`);
})

emailWorker.on('failed', (job) => {
    console.log(`failed to send email`);
})

console.log(`log till last`);
