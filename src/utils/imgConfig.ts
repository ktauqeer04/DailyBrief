import { v4 as uuidv4 } from "uuid";
import path from "path";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import sharp from "sharp"
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})



export const imageValidationAndUpload = async (image: UploadedFile) => {
    const validationError = imageValidator(image.size, image.mimetype);

    if (validationError) {
      return {
        success: false,
        message: validationError,
      };
    }
  
    try {
      // Resize the image using sharp
      const resizedBuffer = await sharp(image.data)
        .resize({ width: 800, height: 600, fit: 'cover' })
        .toBuffer();
  
      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'local_storage' },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        uploadStream.end(resizedBuffer);
      });
  
      return {
        success: true,
        message: (uploadResult as any).secure_url, // Cloudinary image URL
      };

    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return {
        success: false,
        message: "Failed to upload image to Cloudinary",
      };
    }
  };
  

const imageValidator = (size : number , mime: string) =>  {
    if(convertBytesToMb(size) > 3){
        return "Image Size must be less than 3 MB"
    }

    if(!supportedFileTypesorMimes.includes(mime)){
        return "Wrong image type"
    }

    return null;

}

const convertBytesToMb = (bytes: number) => {
    return (Number)(bytes)/(1024 * 1024);
}

const supportedFileTypesorMimes = [
    "image/png", 
    "image/jpg",
    "image/svg",
    "image/jpeg",
    "image/gif",
    "image/webp"
]

export const generateRandomNumber = () => {
    return uuidv4();
}


export const getProfileImageURL = (imageName: string) => {
    const URL = process.env.DEV_URL || "";
    return `${URL}/public/images/${imageName}`;
}

export const defautlImageURL = (imageName : string) => {
    const URL = process.env.DEV_URL || "";
    return `${URL}/public/${imageName}`;
}

export const removeImage = (imageName: string) => {
    const imagePath = path.join(process.cwd(), 'src', 'public', 'images', imageName);
    fs.unlink(imagePath, (error) => {
        if(error){
            console.error(error);
            return;
        }
    })
}

