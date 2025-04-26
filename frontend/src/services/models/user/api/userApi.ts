import { $rtkApi, Assignee, DefaultResponse, NewUserInput, PublicUser } from "#/services/lib";

export const userApi = $rtkApi.injectEndpoints({
    endpoints: (build) => ({
        // Регистрация пользователя
        register: build.mutation<PublicUser, Partial<NewUserInput>>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body: body,
            }),
        }),

        // Аутентификация пользователя
        login: build.mutation<PublicUser, Partial<NewUserInput>>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body: body,
            }),
        }),

        // Выход пользователя
        logout: build.query<void, void>({
            query: () => ({
                url: '/auth/logout',
            }),
        }),

        // Проверка статуса аутентификации
        fetchAuthStatus: build.query<void, void>({
            query: () => ({
                url: 'auth/check_auth',
            }),
        }),
        fetchSubordinates: build.query<DefaultResponse<Assignee[]>, void>({
            query: () => ({
                url: 'user/subordinates',
            }),
        }),
    }),
});

// Экспортируйте хуки для использования в компонентах
export const {
    // Регистрация
    useRegisterMutation,

    // Вход
    useLoginMutation,

    // Выход
    useLogoutQuery,
    useLazyLogoutQuery,

    // Проверка статуса аутентификации
    useFetchAuthStatusQuery,
    useLazyFetchAuthStatusQuery,

    useFetchSubordinatesQuery,
    useLazyFetchSubordinatesQuery,
} = userApi;