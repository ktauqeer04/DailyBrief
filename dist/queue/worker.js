"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.redis = void 0;
const bullmq_1 = require("bullmq");
const dotenv = __importStar(require("dotenv"));
const emailConfig_1 = require("../utils/emailConfig");
dotenv.config();
const bullmq_2 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
exports.redis = new ioredis_1.default({
    username: 'default',
    password: '6bX6eUrzOpEF8IlC6xN28TYNBFkhYEK3',
    host: 'redis-16078.c330.asia-south1-1.gce.redns.redis-cloud.com',
    port: 16078,
    maxRetriesPerRequest: null
});
const connection = new ioredis_1.default({
    username: 'default',
    password: 'taGQx7IqldJ4hqc2blTuHIh0T2x9OKRz',
    host: 'redis-17037.c330.asia-south1-1.gce.redns.redis-cloud.com',
    port: 17037,
    maxRetriesPerRequest: null
});
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
exports.emailQueue = new bullmq_2.Queue('project01-verify-email', {
    connection: connection,
});
const emailWorker = new bullmq_1.Worker('project01-verify-email', async (job) => {
    try {
        const { email, token } = job.data;
        console.log(`Starting to process email job for ${email}`);
        await new Promise((resolve) => {
            console.log("Waiting 4 seconds...");
            setTimeout(resolve, 4000);
        });
        console.log("Attempting to send verification email...");
        await (0, emailConfig_1.sendVerificationEmail)(email, token);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error in worker:", error);
        throw error; // Re-throw to trigger the 'failed' event
    }
}, {
    connection: connection
});
emailWorker.on('completed', (job) => {
    console.log(`email is sent to ${job.data.email}`);
});
emailWorker.on('failed', (job) => {
    console.log(`failed to send email`);
});
console.log(`log till last`);
