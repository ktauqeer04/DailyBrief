"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async register(data) {
        const response = await this.model.create({
            data: data
        });
        return response;
    }
    async findUser(data) {
        const user = await this.model.findFirst({
            where: data
        });
        return user;
    }
    async update(data) {
        const { id, token } = data;
        const response = await this.model.update({
            where: {
                id: id
            },
            data: {
                verification_token: token
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
