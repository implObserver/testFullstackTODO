import { $rtkApi, NewUserInput } from "#/services/lib";
import { FetchRequestParams, IdRequestParams } from "#/services/lib/types/shared/parameters";
import { PaginatedResponse } from "#/services/lib/types/shared/requests.types";
import { FullTask, PublicTask } from "#/services/lib/types/task.types";

export const taskApi = $rtkApi.injectEndpoints({
    endpoints: (build) => ({
        // Регистрация пользователя
        fetchUserTasks: build.query<PaginatedResponse<FullTask>, void>({
            query: () => ({
                url: '/task',
            }),
        }),

        // Аутентификация пользователя
        createUserTask: build.mutation<void, Partial<NewUserInput>>({
            query: (body) => ({
                url: '/task',
                method: 'POST',
                body: body,
            }),
        }),

        // Выход пользователя
        fetchGroupedUserTaskByDeadlines: build.query<void, void>({
            query: () => ({
                url: '/task/grouped/deadlines',
            }),
        }),

        // Проверка статуса аутентификации
        fetchGroupedUserTaskByAssignee: build.query<void, void>({
            query: () => ({
                url: '/task/grouped/assignees',
            }),
        }),

        patchUserTask: build.mutation<void, FetchRequestParams<[IdRequestParams, { body: Partial<PublicTask> }]>>({
            query: (parameters) => ({
                url: `/task/${parameters.id}`,
                method: 'PATCH',
                body: parameters.body,
            }),
        }),
    }),
});

// Экспортируйте хуки для использования в компонентах
export const {
    useCreateUserTaskMutation,
    useFetchGroupedUserTaskByAssigneeQuery,
    useFetchGroupedUserTaskByDeadlinesQuery,
    useFetchUserTasksQuery,
    useLazyFetchGroupedUserTaskByAssigneeQuery,
    useLazyFetchGroupedUserTaskByDeadlinesQuery,
    useLazyFetchUserTasksQuery,
    usePatchUserTaskMutation,
} = taskApi;