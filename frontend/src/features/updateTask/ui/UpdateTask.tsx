import { TaskModal } from "#/entities/taskModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, FullTask, ServerError, TaskModalType } from "#/services/lib";
import { usePatchUserTaskMutation } from "#/services/models/task";
import { useFetchSubordinatesQuery } from "#/services/models/user";
import { SpinnerLoader } from "#/shared/ui/spinnerLoader";
import { useState } from "react";
import { Edit } from 'lucide-react';
import { useUniversalContext } from "#/shared/lib";

export const UpdateTask = () => {
    const task = useUniversalContext<FullTask>();  // Получаем текущую задачу
    const [updateTask] = usePatchUserTaskMutation();  // Хук для обновления задачи
    const { data: assigneers, isLoading } = useFetchSubordinatesQuery();  // Получаем список подчиненных
    const [taskData, setTaskData] = useState<TaskModalType>({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.toString().slice(0, 10),  // Преобразуем дату в строку
        priority: task.priority.toLowerCase(),  // Приводим к строчным значениям
        assigneeId: task.assigneeId.toString(),  // Преобразуем ID ассигнея в строку
        status: task.status.toLowerCase(),  // Приводим к строчным значениям
    });
    const [error, setError] = useState<string | null>(null);  // Состояние для ошибок
    const [open, setOpen] = useState(false);  // Состояние для открытия/закрытия модалки

    const clickHandle = async () => {
        try {
            await updateTask({ ids: { id: task.id }, body: taskData }).unwrap();
            setOpen(false);  // Закрываем модалку при успешном запросе
        } catch (err) {
            const error = err as ServerError;
            const errorMessage = error?.data?.error ?? "Неизвестная ошибка. Попробуйте позже.";
            setError(errorMessage)
            console.log(errorMessage)
        }
    };

    return (
        <Dialog open={open} onOpenChange={(openState) => setOpen(openState)}>
            <DialogTrigger className="!p-2">
                <Edit />
            </DialogTrigger>
            <DialogContent className="!p-4">
                {isLoading && <SpinnerLoader />}
                <DialogHeader>
                    <DialogTitle>Редактирование задачи</DialogTitle>
                    <DialogDescription>
                        Вы не можете редактировать чужие задачи. Только статус.
                        Вы можете переназначать задачи только на себя или подчиненным.
                    </DialogDescription>
                </DialogHeader>
                {error && <div className="text-red-500">{error}</div>}  {/* Отображаем ошибку */}
                <TaskModal
                    assignees={assigneers?.data ?? []}
                    onClick={clickHandle}
                    taskData={taskData}
                    setTaskData={setTaskData}
                    context="Редактировать"
                />
            </DialogContent>
        </Dialog>
    );
};
