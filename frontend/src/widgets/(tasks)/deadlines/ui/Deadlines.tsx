'use client'
import { DeadLineMarker } from "#/entities/deadlineMarker";
import { ItemTable } from "#/entities/itemTable"
import { StatusContainer } from "#/entities/statusContainer";
import { UpdateTask } from "#/features/updateTask";
import { FullTask } from "#/services/lib"
import { useFetchGroupedUserTaskByDeadlinesQuery } from "#/services/models/task"
import { SpinnerLoader } from "#/shared/ui/spinnerLoader";
import { heads } from "../lib/const/table";
import { useSearchParams } from "next/navigation";
import { PaginationPanel } from "#/shared/ui/pagination";

interface TasksProps {
    deadline: string,
}
export const Deadlines: React.FC<TasksProps> = ({ deadline }) => {
    const searchParams = useSearchParams(); // Получаем текущие параметры запроса
    const currentPage = Number(searchParams.get(`page_${deadline}_tasks`)) || 1;
    const perPage = 10; // Количество элементов на странице
    let totalPages = 1; // Значение по умолчанию

    const { data: tasks, isLoading, error } = useFetchGroupedUserTaskByDeadlinesQuery({ page: currentPage, limit: perPage, group: deadline });

    if (tasks?.paginate.totalItems) {
        totalPages = Math.ceil(tasks?.paginate.totalItems / perPage);
    }

    if (isLoading) return <SpinnerLoader />
    if (error) return <div className='!p-2'>Ошибка загрузки задач</div>

    return (
        <div className="grid !mt-4">
            <ItemTable<FullTask>
                items={tasks?.data ?? []}
                heads={heads}
                keys={
                    [
                        "title",
                        "description",
                        (task: FullTask) => <DeadLineMarker task={task} />,
                        "createdAt",
                        "updatedAt",
                        "priority",
                        (task: FullTask) => <StatusContainer status={task.status} />,
                        "creator",
                        "assignee"
                    ]
                }
                features={[<UpdateTask key={1} />]}
            />
            {!isLoading && (
                <PaginationPanel className="!p-2" totalPages={totalPages} page_key={`${deadline}_tasks`} />
            )}
            {tasks?.data.length === 0 && <span className='!p-4'>Нет задач</span>}
        </div>
    )
}