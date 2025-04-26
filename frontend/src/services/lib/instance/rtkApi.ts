'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        headers.set('Accept', 'application/json');
        return headers;
    },
});

const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    console.log(result)
    // Если статус ответа 401 (Unauthorized), делаем редирект на /login
    if (result.error?.status === 401) {
        window.location.href = '/login';
    }

    return result;
};

export const $rtkApi = createApi({
    reducerPath: 'rtkApi',
    tagTypes: [
        'tasks'
    ],
    baseQuery: baseQueryWithAuth,
    endpoints: () => ({}),
});