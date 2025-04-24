import { PaginationOptions } from "../../types/serviceTypes/utils.types.js";

export const getPagination = (options: PaginationOptions = {}) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    return { skip, take: limit };
};