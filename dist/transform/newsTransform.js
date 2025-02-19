"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class NewsTransform {
    static Transform(news) {
        return {
            id: news.id,
            title: news.title,
            content: news.content,
            image: utils_1.ImageHelper.getProfileImageURL(news.image),
            created_at: news.created_at,
            author: {
                id: news.author.id,
                name: news.author.name,
                profile: news.author.profile !== null ? utils_1.ImageHelper.getProfileImageURL(news.author.profile) : utils_1.ImageHelper.defautlImageURL("defaultImage.webp")
            }
        };
    }
}
exports.default = NewsTransform;
