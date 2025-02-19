import { AuthRepository } from "../repository/authRepo"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authRepository = new AuthRepository(prisma.people);

export const registerUser = async (data: any) => {
    try {
        const createUser = await authRepository.register(data);
        return createUser;    
    } catch (error) {
        console.log(error);
    }
}


export const findUser = async (data: any) => {
    try {
        const findthisUser = await authRepository.findUser(data);
        return findthisUser;
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (data: any) => {
    try {
        console.log(data);
        const updateThisUser = await authRepository.update(data);
        return updateThisUser;
    } catch (error) {
        console.log(error);
    }
}

// export const updateVerifiedEmail = async(data: any) => {
//     try {
//         const updateThisUser = await 
//     } catch (error) {
        
//     }
// }