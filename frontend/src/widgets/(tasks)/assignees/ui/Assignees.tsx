'use client'
import { useFetchGroupedUserTaskByAssigneeQuery } from "#/services/models/task"
import { SpinnerLoader } from "#/shared/ui/spinnerLoader";
import { useSearchParams } from "next/navigation";
import { PaginationPanel } from "#/shared/ui/pagination";
import { Tasks } from "../components/tasks";

export const Assignees = () => {
    const searchParams = useSearchParams(); // Получаем текущие параметры запроса
    const currentPage = Number(searchParams.get('page_assignees')) || 1;
    const perPage = 10; // Количество элементов на странице
    let totalPages = 1; // Значение по умолчанию

    const { data: groups, isLoading, error } = useFetchGroupedUserTaskByAssigneeQuery({ page: currentPage, limit: perPage });
    console.log(groups?.data)
    if (groups?.paginate.totalItems) {
        totalPages = Math.ceil(groups?.paginate.totalItems / perPage);
    }

    if (isLoading) return <SpinnerLoader />
    if (error) return <div className='!p-2'>Ошибка загрузки задач</div>

    const renderGroups = () => {
        return groups?.data.map((group, index) => {
            const fullName = `${group.assignee.lastName} ${group.assignee.firstName} ${group.assignee.middleName}`
            return (
                <div className="grid" key={group.assignee.id}>
                    <div className="flex !ml-2 gap-2 items-center">
                        <span className="text-xl">{index + 1}:</span>
                        <span className="rounded-[10px] border-2 border-purple-400 bg-purple-100 hover:bg-purple-200 w-max !p-2 text-xl">{fullName}</span>
                    </div>
                    <Tasks tasks={group.tasks} />
                </div>
            )
        })
    }

    return (
        <div className="grid !mt-4">
            <span className="!p-2 text-2xl">Задачи ваших подчиненных:</span>
            {renderGroups()}
            {!isLoading && (
                <PaginationPanel className="!p-2" totalPages={totalPages} page_key="assignees" />
            )}
            {groups?.data.length === 0 && <span className='!p-4'>Нет задач</span>}
        </div>
    )
}