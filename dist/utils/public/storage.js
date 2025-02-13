"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage });
const uploadToCloudinary = async (req, res, next) => {
    try {
        if (!req.files || !(req.files instanceof Array)) {
            return next(new Error('No files provided or invalid file format'));
        }
        const files = req.files;
        if (!files || files.length === 0) {
            return next(new Error('No files provided'));
        }
        const cloudinaryUrls = [];
        for (const file of files) {
            const resizedBuffer = await (0, sharp_1.default)(file.buffer)
                .resize({ width: 800, height: 600 })
                .toBuffer();
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'local_storage',
            }, (err, result) => {
                if (err) {
                    console.error('Cloudinary upload error:', err);
                    return next(err);
                }
                if (!result) {
                    console.error('Cloudinary upload error: Result is undefined');
                    return next(new Error('Cloudinary upload result is undefined'));
                }
                cloudinaryUrls.push(result.secure_url);
                if (cloudinaryUrls.length === files.length) {
                    //All files processed now get your images here
                    req.body.cloudinaryUrls = cloudinaryUrls;
                    next();
                }
            });
            uploadStream.end(resizedBuffer);
        }
    }
    catch (error) {
        console.error('Error in uploadToCloudinary middleware:', error);
        next(error);
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
