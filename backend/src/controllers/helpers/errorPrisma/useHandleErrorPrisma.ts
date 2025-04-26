import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { PrismaError } from "../../../types/serviceTypes/utils.types.js";

export const handlePrismaError = (error: Error | PrismaError) => {
    if (error instanceof PrismaClientValidationError) {
        return {
            statusCode: 400,
            message: 'Ошибка валидации данных',
            details: error.message,
        };
    } else if (error instanceof PrismaClientKnownRequestError) {
        return {
            statusCode: 400,
            message: 'Ошибка запроса к базе данных',
        };
    } else if (error instanceof PrismaClientUnknownRequestError) {
        return {
            statusCode: 500,
            message: 'Неизвестная ошибка запроса к базе данных',
        };
    } else {
        return {
            statusCode: 500,
            message: 'Неизвестная ошибка',
        };
    }
};