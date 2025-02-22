"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRepository = void 0;
// findMany
// skip, include, where, orderBy, take, select, 
class NewsRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findByid(parameters) {
        const response = await this.model.findFirst(parameters);
        return response;
    }
    async findMany(parameters) {
        const response = await this.model.findMany(parameters);
        return response;
    }
    async count() {
    }
    async create(data) {
    }
    async update(data) {
    }
    async delete(data) {
    }
}
exports.NewsRepository = NewsRepository;
