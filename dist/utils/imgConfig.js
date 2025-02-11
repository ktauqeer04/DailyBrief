"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.defautlImageURL = exports.getProfileImageURL = exports.generateRandomNumber = exports.imageValidationAndUpload = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const imageValidationAndUpload = async (image) => {
    const validationError = imageValidator(image.size, image.mimetype);
    if (validationError) {
        return {
            success: false,
            message: validationError,
        };
    }
    try {
        // Resize the image using sharp
        const resizedBuffer = await (0, sharp_1.default)(image.data)
            .resize({ width: 800, height: 600, fit: 'cover' })
            .toBuffer();
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: 'local_storage' }, (error, result) => {
                if (error)
                    reject(error);
                resolve(result);
            });
            uploadStream.end(resizedBuffer);
        });
        return {
            success: true,
            message: uploadResult.secure_url, // Cloudinary image URL
        };
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return {
            success: false,
            message: "Failed to upload image to Cloudinary",
        };
    }
};
exports.imageValidationAndUpload = imageValidationAndUpload;
const imageValidator = (size, mime) => {
    if (convertBytesToMb(size) > 3) {
        return "Image Size must be less than 3 MB";
    }
    if (!supportedFileTypesorMimes.includes(mime)) {
        return "Wrong image type";
    }
    return null;
};
const convertBytesToMb = (bytes) => {
    return (Number)(bytes) / (1024 * 1024);
};
const supportedFileTypesorMimes = [
    "image/png",
    "image/jpg",
    "image/svg",
    "image/jpeg",
    "image/gif",
    "image/webp"
];
const generateRandomNumber = () => {
    return (0, uuid_1.v4)();
};
exports.generateRandomNumber = generateRandomNumber;
const getProfileImageURL = (imageName) => {
    const URL = process.env.DEV_URL || "";
    return `${URL}/public/images/${imageName}`;
};
exports.getProfileImageURL = getProfileImageURL;
const defautlImageURL = (imageName) => {
    const URL = process.env.DEV_URL || "";
    return `${URL}/public/${imageName}`;
};
exports.defautlImageURL = defautlImageURL;
const removeImage = (imageName) => {
    const imagePath = path_1.default.join(process.cwd(), 'src', 'public', 'images', imageName);
    fs_1.default.unlink(imagePath, (error) => {
        if (error) {
            console.error(error);
            return;
        }
    });
};
exports.removeImage = removeImage;
