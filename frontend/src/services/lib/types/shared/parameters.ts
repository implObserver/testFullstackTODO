export interface PaginatedRequestParams {
    limit: number;
    page: number;
}

export interface IdRequestParams {
    [key: string]: string | number,
}

export interface FilterParam {
    [key: string]: string,
}

export interface SortParam {
    [key: string]: string,
}
export interface Groups {
    today?: 'today',
    week?: 'thisWeek',
    future?: 'future',
}

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type FetchRequestParams<T extends object[]> = UnionToIntersection<T[number]>;

export type CompositeType<T extends object[]> = UnionToIntersection<T[number]>;
