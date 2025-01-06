import { Worker, Queue } from "bullmq";
import * as dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/emailConfig";
import IORedis from "ioredis";

dotenv.config();

// Use REDIS_URL from environment variables
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    // Exponential backoff with max delay of 10 seconds
    const delay = Math.min(times * 50, 10000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  }
});

connection.on('error', (error) => {
  console.error('Redis connection error:', error);
});

connection.on('connect', () => {
  console.log('Successfully connected to Redis');
});

export const emailQueue = new Queue('project01-verify-email', {
  connection,
});

const emailWorker = new Worker('project01-verify-email', async (job) => {
  const { email, token } = job.data;
    
  await new Promise((resolve) => {
    console.log("the email worker data is", job.data);
    setTimeout(resolve, 4000);
  });

  await sendVerificationEmail(email, token);
}, {
  connection,
});

emailWorker.on('completed', (job) => {
  console.log(`Email sent to ${job.data.email}`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Failed to send email:`, err);
});

console.log('Worker initialized');