"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRegister = ValidateRegister;
exports.ValidateNews = ValidateNews;
const zodValidation_1 = require("../validations/zodValidation");
function ValidateRegister(inputs) {
    const validate = zodValidation_1.userSchema.safeParse(inputs);
    if (!validate.success) {
        const error = validate.error.errors[0].message;
        return {
            isError: true,
            error: error
        };
    }
    return {
        isError: false,
        error: "no Error"
    };
}
function ValidateNews(inputs) {
    const validate = zodValidation_1.newsSchema.safeParse(inputs);
    if (!validate.success) {
        const error = validate.error.errors[0].message;
        return {
            isError: true,
            error: error,
        };
    }
    return {
        isError: false,
        error: "no Error"
    };
}
