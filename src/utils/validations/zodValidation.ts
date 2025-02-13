import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
});

export const newsSchema = z.object({
    title: z.string().min(1, { message: "Title is Required" }),
    content: z.string().min(100, {message: "Content Should atleast be of 100 words"})
})

