import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  });