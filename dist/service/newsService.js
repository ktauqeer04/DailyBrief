"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllNews = exports.findById = void 0;
const newsRepo_1 = require("../repository/newsRepo");
const db_1 = require("../db");
const newsRepository = new newsRepo_1.NewsRepository(db_1.prisma.news);
const findById = async (parameters) => {
    try {
        const findThisNews = await newsRepository.findByid(parameters);
        return findThisNews;
    }
    catch (error) {
        console.log(error);
    }
};
exports.findById = findById;
const findAllNews = async (parameters) => {
    try {
        const getAllNews = await newsRepository.findMany(parameters);
        return getAllNews;
    }
    catch (error) {
        console.log(error);
    }
};
exports.findAllNews = findAllNews;
