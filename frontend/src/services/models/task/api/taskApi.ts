import { $rtkApi } from "#/services/lib";
import { FetchRequestParams, IdRequestParams, PaginatedRequestParams } from "#/services/lib/types/shared/parameters";
import { PaginatedResponse } from "#/services/lib/types/shared/requests.types";
import { AssigneeGroup, FullTask, PublicTask, TaskModalType } from "#/services/lib/types/task.types";

export const taskApi = $rtkApi.injectEndpoints({
    endpoints: (build) => ({
        fetchUserTasks: build.query<PaginatedResponse<FullTask>, PaginatedRequestParams>({
            query: (parameters) => {
                const params = new URLSearchParams();
                params.append('page', parameters.page.toString());
                params.append('paginate', parameters.limit.toString());
                return {
                    url: `/tasks/?${params.toString()}`,
                };
            },
            providesTags: ['tasks'],
        }),

        createUserTask: build.mutation<void, Partial<TaskModalType>>({
            query: (body) => ({
                url: '/tasks',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['tasks'],
        }),

        fetchGroupedUserTaskByDeadlines: build.query<PaginatedResponse<FullTask>, FetchRequestParams<[PaginatedRequestParams, { group: string }]>>({
            query: (parameters) => {
                const params = new URLSearchParams();
                params.append('page', parameters.page.toString());
                params.append('paginate', parameters.limit.toString());

                if (parameters.group) params.append('group', parameters.group.toString());
            
                return {
                    url: `/tasks/grouped/deadlines?${params.toString()}`,
                };
            },
            providesTags: ['tasks'],
        }),

        fetchGroupedUserTaskByAssignee: build.query<PaginatedResponse<AssigneeGroup>, PaginatedRequestParams>({
            query: (parameters) => {
                const params = new URLSearchParams();
                params.append('page', parameters.page.toString());
                params.append('paginate', parameters.limit.toString());
            
                return {
                    url: `/tasks/grouped/assignees?${params.toString()}`,
                };
            },
            providesTags: ['tasks'],
        }),

        patchUserTask: build.mutation<void, FetchRequestParams<[{ ids: IdRequestParams }, { body: TaskModalType }]>>({
            query: (parameters) => ({
                url: `/tasks/${parameters.ids.id}`,
                method: 'PATCH',
                body: parameters.body,
            }),
            invalidatesTags: ['tasks'],
        }),
        updateUserTask: build.mutation<void, FetchRequestParams<[{ body: PublicTask }, IdRequestParams,]>>({
            query: (parameters) => ({
                url: `/tasks/${parameters.id}`,
                method: 'PUT',
                body: parameters.body,
            }),
            invalidatesTags: ['tasks'],
        }),
    }),
});

export const {
    useCreateUserTaskMutation,
    useFetchGroupedUserTaskByAssigneeQuery,
    useFetchGroupedUserTaskByDeadlinesQuery,
    useFetchUserTasksQuery,
    useLazyFetchGroupedUserTaskByAssigneeQuery,
    useLazyFetchGroupedUserTaskByDeadlinesQuery,
    useLazyFetchUserTasksQuery,
    usePatchUserTaskMutation,
    useUpdateUserTaskMutation,
} = taskApi;