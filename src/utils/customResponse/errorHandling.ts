import { newsSchema, userSchema } from "../validations/zodValidation";


interface UserRegister{
    name: string,
    email: string
    password: string,
}

interface News{
    title: string,
    content: string,
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

export function ValidateNews(inputs: News){
    const validate = newsSchema.safeParse(inputs);
    if(!validate.success){
        const error = validate.error.errors[0].message;
        return {
            isError: true,
            error: error,
        }
    }
    return {
        isError: false,
        error: "no Error"
    };
}