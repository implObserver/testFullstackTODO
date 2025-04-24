import { $rtkApi, NewUserInput, PublicUser } from "#/services/lib";

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
                url: '/check_auth',
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
} = userApi;