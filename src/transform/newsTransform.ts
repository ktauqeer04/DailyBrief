import { defautlImageURL, getProfileImageURL } from "../utils/imgConfig";

interface News{
    id: number,
    title: string,
    content: string,
    image: string,
    created_at: Date,
    author: {
        id: number,
        name: string,
        profile: string | null
    }
}

export class NewsTransform{

    static Transform(news: News){

        return {
            id: news.id,
            title: news.title,
            content: news.content,
            image: getProfileImageURL(news.image),
            created_at: news.created_at,
            reporter:{
                id: news.author.id,
                name: news.author.name,
                profile: news.author.profile !== null ? getProfileImageURL(news.author.profile) : defautlImageURL("defaultImage.webp")
            }
        }

    }

}