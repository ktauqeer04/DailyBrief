import { userSchema, newsSchema } from "./validations/zodValidation";
import { limiter } from "./security/rateLimiter";
import { ValidateNews, ValidateRegister } from "./customResponse/errorHandling";
import { sendNotificationEmail, sendVerificationEmail } from "./config/emailConfig";
import { redis, emailQueue, notificationQueue, notificationWorker } from "./queue/worker";
import { imageValidationAndUpload, generateRandomNumber, getProfileImageURL, defautlImageURL, removeImage } from "./config/imgConfig";


export const zodValidation = {
    userSchema,
    newsSchema
}

export const Security = {
    limiter
}

export const Validation = {
    ValidateNews,
    ValidateRegister
}

export const EmailConfig = {
    sendNotificationEmail,
    sendVerificationEmail
}

export const Queue = {
    redis,
    emailQueue,
    notificationQueue,
    notificationWorker
}

export const ImageHelper = {
    imageValidationAndUpload, 
    generateRandomNumber, 
    getProfileImageURL,
    defautlImageURL, 
    removeImage
}