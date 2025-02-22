import { AuthRepository } from "../repository/authRepo"
import { findUsers, register, updateUser1, updateUser2 } from "../types/authTypes/types";
import { prisma } from "../db";

const authRepository = new AuthRepository(prisma.people);



export const registerUser = async (data: register) => {
    try {
        const createUser = await authRepository.register(data);
        return createUser;    
    } catch (error) {
        console.log(error);
    }
}


export const findUser = async (data: findUsers) => {
    try {
        const findthisUser = await authRepository.find(data);
        return findthisUser;
    } catch (error) {
        console.log(error);
    }
}


export const updateUser = async (data: updateUser1 | updateUser2) => {
    try {
        console.log(data);
        const updateThisUser = await authRepository.update(data);
        return updateThisUser;
    } catch (error) {
        console.log(error);
    }
}