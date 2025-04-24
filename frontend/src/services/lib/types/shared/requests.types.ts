import { PaginatedRequestParams } from "./parameters";

export interface PaginationMeta extends PaginatedRequestParams {
    totalPages: number,
    totalItems: number,
}

export interface PaginatedResponse<T, D = T[]> {
    data: D;
    pagination: PaginationMeta,
}

export type ServerError = {
    status: number;
    data: {
        error: string;
    };
};