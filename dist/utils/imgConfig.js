"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.defautlImageURL = exports.getProfileImageURL = exports.generateRandomNumber = exports.imageValidationAndUpload = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const imageValidationAndUpload = (image) => {
    const imgSizeValidation = imageValidator(image.size, image.mimetype);
    if (imgSizeValidation !== null) {
        return {
            success: false,
            message: imgSizeValidation
        };
    }
    const imgName = image.name;
    const extension = imgName.split(".");
    const newImageName = (0, exports.generateRandomNumber)() + "." + extension[1];
    const uploadPath = path_1.default.join(process.cwd(), 'src', 'public', 'images', newImageName);
    // console.log(uploadPath);
    image.mv(uploadPath, (error) => {
        if (error) {
            console.error(error);
        }
    });
    return {
        success: true,
        message: newImageName
    };
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
