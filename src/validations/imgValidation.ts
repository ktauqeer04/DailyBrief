import { v4 as uuidv4 } from "uuid";

export const imageValidator= (size : number , mime: string) =>  {
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