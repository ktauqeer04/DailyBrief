import { PrismaClient, People } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthRepository {

    model: PrismaClient["people"];

    constructor(model: PrismaClient["people"]){
        this.model = model;
    }

    async register(data: any) {

        const response = await this.model.create({
            data: data
        })

        return response;   

    }

    async findUser(data: any) {
        const user = await this.model.findFirst({
            where: data
        })

        return user;
    }
    
    
    async update(data: any){  

        const whereData = data.where;
        const updateData = data.data;
        
        const response = await this.model.update({
            where: whereData,
            data: updateData
        });

        return response;
    }

}
