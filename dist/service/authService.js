"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.findUser = exports.registerUser = void 0;
const authRepo_1 = require("../repository/authRepo");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authRepository = new authRepo_1.AuthRepository(prisma.people);
const registerUser = async (data) => {
    try {
        const createUser = await authRepository.register(data);
        return createUser;
    }
    catch (error) {
        console.log(error);
    }
};
exports.registerUser = registerUser;
const findUser = async (data) => {
    try {
        const findthisUser = await authRepository.find(data);
        return findthisUser;
    }
    catch (error) {
        console.log(error);
    }
};
exports.findUser = findUser;
const updateUser = async (data) => {
    try {
        console.log(data);
        const updateThisUser = await authRepository.update(data);
        return updateThisUser;
    }
    catch (error) {
        console.log(error);
    }
};
exports.updateUser = updateUser;
