import { v4 as uuidv4 } from "uuid";
import path from "path";
import { UploadedFile } from "express-fileupload";

export const imageValidation = (image: UploadedFile) => {

    const imgSizeValidation = imageValidator(image.size, image.mimetype);
    
    if(imgSizeValidation !== null){
        return {
            success: false,
            message: imgSizeValidation
        };
    }
                
    const imgName = image.name;
    const extension = imgName.split(".");
    const newImageName = generateRandomNumber() + "." + extension[1];
    const uploadPath = path.join(process.cwd(), 'src', 'public', 'images', newImageName);
    
    console.log(uploadPath);
    
    image.mv(uploadPath, (error) => {
        if(error){
            console.error(error);      
        }
    })

    return {
        success: true,
        message: newImageName
    }
}

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