import { tryCatch, Worker } from "bullmq";
import * as dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/emailConfig";
dotenv.config();
import { Queue } from "bullmq";
import Redis from "ioredis";

// export const redis = new Redis({
//     username: 'default',
//     password: '6bX6eUrzOpEF8IlC6xN28TYNBFkhYEK3',
//     host: 'redis-16078.c330.asia-south1-1.gce.redns.redis-cloud.com',
//     port: 16078,
//     maxRetriesPerRequest: null
// })
const redisConfig = {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
}

export const connection = new Redis(redisConfig);
export const redis = new Redis(redisConfig)

connection.on('connect', () => {
    console.log('Connected to Redis successfully');
});

connection.on('error', (err) => {
    console.error('Redis connection error:', err);
});
// const redisConfig = {
//     host: process.env.REDIS_HOST || 'localhost', // Default to localhost for local development
//     port: parseInt(process.env.REDIS_PORT || '6379', 10), // Default Redis port
// };

export const emailQueue = new Queue('project01-verify-email', {
    connection: connection,
});


const emailWorker = new Worker('project01-verify-email', async (job) => {

    try {
        const { email, token } = job.data;
        console.log(`Starting to process email job for ${email}`);
        
        // await new Promise((resolve) => {
        //     console.log("Waiting 4 seconds...");
        //     setTimeout(resolve, 4000)
        // });
        
        console.log("Attempting to send verification email...");
        await sendVerificationEmail(email, token);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error in worker:", error);
        throw error; // Re-throw to trigger the 'failed' event
    }


},{
    connection: connection,
})

emailWorker.on('completed', (job) => {
    console.log(`email is sent to ${job.data.email}`);
})

emailWorker.on('failed', (job) => {
    console.log(`failed to send email`);
})

console.log(`log till last`);
