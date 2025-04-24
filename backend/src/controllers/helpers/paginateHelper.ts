import { PaginationOptions } from "../../types/serviceTypes/utils.types.js";

export const paginateArray = <T>(items: T[], options: PaginationOptions) => {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = items.slice(start, end);

    return {
        paginated,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
        },
    };
};