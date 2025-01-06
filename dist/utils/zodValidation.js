"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    email: zod_1.z.string().email({ message: "Please provide a valid email address" }),
    password: zod_1.z.string().min(4, { message: "Password must be at least 4 characters long" }),
});
exports.newsSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "Title is Required" }),
    content: zod_1.z.string().min(100, { message: "Content Should atleast be of 100 words" })
});
