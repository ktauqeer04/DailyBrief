import { Worker } from "bullmq";
import * as dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/emailConfig";
dotenv.config();
import { Queue } from "bullmq";
import Redis from "ioredis";

export const redis = new Redis({
    username: 'default',
    password: 'taGQx7IqldJ4hqc2blTuHIh0T2x9OKRz',
    host: 'redis-17037.c330.asia-south1-1.gce.redns.redis-cloud.com',
    port: 17037,
    maxRetriesPerRequest: null
}
);
// const redisConfig = {
//     host: process.env.REDIS_HOST || 'localhost', // Default to localhost for local development
//     port: parseInt(process.env.REDIS_PORT || '6379', 10), // Default Redis port
// };

export const emailQueue = new Queue('project01-verify-email', {
    connection: redis,
});


const emailWorker = new Worker('project01-verify-email', async (job) => {

    const { email, token } = job.data;
    
    await new Promise((resolve) => {
        console.log("the email worker data is", job.data);
        setTimeout(resolve, 4000)
    });

    await sendVerificationEmail(email, token);
    
},{
    connection: redis
})

emailWorker.on('completed', (job) => {
    console.log(`email is sent to ${job.data.email}`);
})

emailWorker.on('failed', (job) => {
    console.log(`failed to send email`);
})

console.log(`log till last`);
