import { PrismaClient } from "@prisma/client";


// findMany
// skip, include, where, orderBy, take, select, 


export class NewsRepository{

    model: PrismaClient["news"];

    constructor(model: PrismaClient["news"]){
        this.model = model;
    }


    async findByid(parameters: any){

        const response = await this.model.findFirst(parameters);
        return response;

    }

    async findMany(parameters: any){

        const response = await this.model.findMany(parameters);
        return response;
        
    }

    async count(){

    }

    async create(data: any){

    }

    async update(data: any){

    }

    async delete(data: any){

    }

}
