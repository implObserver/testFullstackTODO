export interface PaginatedRequestParams {
    limit: number;
    page: number;
}

export interface IdRequestParams {
    id?: string;
}

export interface FilterParam {
    [key: string]: string,
}

export interface SortParam {
    [key: string]: string,
}

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type FetchRequestParams<T extends object[]> = UnionToIntersection<T[number]>;

export type CompositeType<T extends object[]> = UnionToIntersection<T[number]>;
