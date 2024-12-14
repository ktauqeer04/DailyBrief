import { boolean, z } from "zod";
import { userSchema } from "./zodValidation";


interface UserRegister{
    name: string,
    email: string
    password: string,
}

export function ValidateRegister(inputs: UserRegister){
    const validate = userSchema.safeParse(inputs);
    if(!validate.success){
        const error = validate.error.errors[0].message;
        return {
            isError: true,
            error: error
        }
    }
    return {
        isError: false,
        error: "no Error"
    };
}