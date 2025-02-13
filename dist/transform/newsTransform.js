"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsTransform = void 0;
const imgConfig_1 = require("../utils/config/imgConfig");
class NewsTransform {
    static Transform(news) {
        return {
            id: news.id,
            title: news.title,
            content: news.content,
            image: (0, imgConfig_1.getProfileImageURL)(news.image),
            created_at: news.created_at,
            author: {
                id: news.author.id,
                name: news.author.name,
                profile: news.author.profile !== null ? (0, imgConfig_1.getProfileImageURL)(news.author.profile) : (0, imgConfig_1.defautlImageURL)("defaultImage.webp")
            }
        };
    }
}
exports.NewsTransform = NewsTransform;
