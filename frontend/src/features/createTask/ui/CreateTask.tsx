'use client'
import { TaskModal } from "#/entities/taskModal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, ServerError } from "#/services/lib"
import { useCreateUserTaskMutation } from "#/services/models/task";
import { useFetchSubordinatesQuery } from "#/services/models/user";
import { SpinnerLoader } from "#/shared/ui/spinnerLoader";
import { useState } from "react";

export const CreateTask = () => {
    const [createTask] = useCreateUserTaskMutation();
    const { data: assigneers, isLoading } = useFetchSubordinatesQuery();
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'low',
        assigneeId: '',
        status: '',
    });
    const [error, setError] = useState<string | null>(null); // Состояние для ошибки
    const [open, setOpen] = useState(false); // Состояние для открытия/закрытия модалки

    const clickHandle = async () => {
        try {
            await createTask(taskData).unwrap();
            setOpen(false); // Закрываем модалку при успешном запросе
        } catch (err) {
            const error = err as ServerError;
            const errorMessage = error?.data?.error ?? "Неизвестная ошибка. Попробуйте позже.";
            setError(errorMessage)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(openState) => setOpen(openState)}>
            <DialogTrigger className='!ml-4 hover:bg-green-200 cursor-pointer max-w-[150px] !ml-2 rounded-[10px] border-green-200 bg-green-50 border-2 !p-2'>Создать задачу</DialogTrigger>
            <DialogContent className="!p-4">
                {isLoading && <SpinnerLoader />}
                <DialogHeader>
                    <DialogTitle>Создание задачи</DialogTitle>
                    <DialogDescription>
                        Вы можете назначать задачи только на себя или подчиненным.
                    </DialogDescription>
                </DialogHeader>
                {error && <div className="text-red-500">{error}</div>} {/* Выводим ошибку */}
                <TaskModal assignees={assigneers?.data ?? []} onClick={clickHandle} taskData={taskData} setTaskData={setTaskData} context="Создать" />
            </DialogContent>
        </Dialog>
    )
}
