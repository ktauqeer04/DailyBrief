"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageHelper = exports.Queue = exports.EmailConfig = exports.Validation = exports.Security = exports.zodValidation = void 0;
const zodValidation_1 = require("./validations/zodValidation");
const rateLimiter_1 = require("./security/rateLimiter");
const errorHandling_1 = require("./customResponse/errorHandling");
const emailConfig_1 = require("./config/emailConfig");
const worker_1 = require("./queue/worker");
const imgConfig_1 = require("./config/imgConfig");
exports.zodValidation = {
    userSchema: zodValidation_1.userSchema,
    newsSchema: zodValidation_1.newsSchema
};
exports.Security = {
    limiter: rateLimiter_1.limiter
};
exports.Validation = {
    ValidateNews: errorHandling_1.ValidateNews,
    ValidateRegister: errorHandling_1.ValidateRegister
};
exports.EmailConfig = {
    sendNotificationEmail: emailConfig_1.sendNotificationEmail,
    sendVerificationEmail: emailConfig_1.sendVerificationEmail
};
exports.Queue = {
    redis: worker_1.redis,
    emailQueue: worker_1.emailQueue,
    notificationQueue: worker_1.notificationQueue,
    notificationWorker: worker_1.notificationWorker
};
exports.ImageHelper = {
    imageValidationAndUpload: imgConfig_1.imageValidationAndUpload,
    generateRandomNumber: imgConfig_1.generateRandomNumber,
    getProfileImageURL: imgConfig_1.getProfileImageURL,
    defautlImageURL: imgConfig_1.defautlImageURL,
    removeImage: imgConfig_1.removeImage
};
