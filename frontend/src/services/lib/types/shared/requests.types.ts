import { PaginatedRequestParams } from "./parameters";

export interface PaginationMeta extends PaginatedRequestParams {
    totalPages: number,
    totalItems: number,
}

export interface PaginatedResponse<T, D = T[]> {
    data: D;
    paginate: PaginationMeta,
}

export interface DefaultResponse<T, D = T> {
    data: D;
}

export type ServerError = {
    status: number;
    data: {
        error: string;
    };
};