"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("@prisma/client/extension");
class crudRepository {
    model;
    constructor() {
        this.model = new extension_1.PrismaClient();
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
    async getAll() {
    }
    async create() {
    }
    async delete() {
    }
    async update() {
    }
}
