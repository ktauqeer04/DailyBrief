import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";


class crudRepository<T> {

    model: PrismaClient

    constructor(){
        this.model = new PrismaClient();
    }

    // async getSpecific(id: number){
    //     const getThisSpecific = await this.model.findUnique({
    //         where: {
    //             id
    //         },
    //         select:{
    //             id: true,
    //             title: true,
    //             image: true,
    //             author: {
    //                 select:{
    //                     id: true,
    //                     name: true,
    //                     profile: true
    //                 }
    //             }
    //         }
    //     })
    // }

    async getAll(){

    }

    async create(){

    }

    async delete(){

    }

    async update(){

    }

}