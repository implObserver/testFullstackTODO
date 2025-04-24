import { Response } from "express";

type Paginate = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
};

type ApiResponse<T> =
    | { data: T }
    | { data: T; paginate: Paginate };

export function sendResponse<T>(
    res: Response,
    data: T,
    paginate?: Paginate,
    statusCode = 200
): Response<ApiResponse<T>> {
    const responseBody = paginate
        ? { data, paginate }
        : { data };

    return res.status(statusCode).json(responseBody);
}
