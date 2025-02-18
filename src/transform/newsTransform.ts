import { ImageHelper } from "../utils";

export interface News{
    id?: number,
    title: string,
    content?: string,
    image: string,
    created_at?: Date,
    author: {
        id: number,
        name: string,
        profile: string | null
    }
}

class NewsTransform{

    static Transform(news: News){

        return {
            id: news.id,
            title: news.title,
            content: news.content,
            image: ImageHelper.getProfileImageURL(news.image),
            created_at: news.created_at,
            author:{
                id: news.author.id,
                name: news.author.name,
                profile: news.author.profile !== null ? ImageHelper.getProfileImageURL(news.author.profile) : ImageHelper.defautlImageURL("defaultImage.webp")
            }
            
        }

    }

}

export default NewsTransform;