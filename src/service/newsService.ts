import { NewsRepository } from "../repository/newsRepo";
import { prisma } from "../db";


const newsRepository = new NewsRepository(prisma.news);


export const findById = async (parameters: any) => {

    try {

        const findThisNews = await newsRepository.findByid(parameters);
        return findThisNews;

    } catch (error) {

        console.log(error);

    }

}



export const findAllNews = async (parameters: any) => {

    try {
        
        const getAllNews = await newsRepository.findMany(parameters);
        return getAllNews;

    } catch (error) {

        console.log(error);

    }

}



