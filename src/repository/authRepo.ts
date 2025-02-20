import { PrismaClient, People } from "@prisma/client";
import { findUsers, register, updateUser1, updateUser2 } from "../types/authTypes/types";

const prisma = new PrismaClient();

export class AuthRepository {

    model: PrismaClient["people"];

    constructor(model: PrismaClient["people"]){
        this.model = model;
    }

    async register(data: register) {

        const response = await this.model.create({
            data: data
        })

        return response;   

    }

    async find(data: findUsers) {

        const user = await this.model.findFirst({
            where: data
        })

        return user;
    }
    
    
    async update(data: updateUser1 | updateUser2){  

        const whereData = data.where;
        const updateData = data.data;
        
        const response = await this.model.update({
            where: whereData,
            data: updateData
        });

        return response;
    }

}
