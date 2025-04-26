import { Assignee, Button, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '#/services/lib';
import { TaskModalType } from '#/services/lib/types/task.types';
import { MouseEvent } from 'react';

const priorities = ['low', 'medium', 'high'];
const statuses = [
    {
        key: 'todo',
        label: 'К выполнению'
    },
    {
        key: 'in_progress',
        label: 'В процессе'
    },
    {
        key: 'done',
        label: 'Выполнена'
    },
    {
        key: 'canceled',
        label: 'Отменена'
    }
];
const inputStyle = '!p-2 col-span-3';

export const TaskModal = ({
    onClick,
    assignees,
    context,
    taskData,
    setTaskData
}: {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void,
    context: string;
    taskData: TaskModalType;
    setTaskData: (newData: TaskModalType) => void;
    assignees: Assignee[]
}) => {
    return (
        <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                    Заголовок
                </Label>
                <Input
                    id="title"
                    placeholder="Enter task title"
                    className={inputStyle}
                    value={taskData.title}
                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                    Описание
                </Label>
                <Input
                    id="description"
                    placeholder="Enter task description"
                    className={inputStyle}
                    value={taskData.description}
                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                />
            </div>

            {/* Due Date */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                    Дата окончания
                </Label>
                <Input
                    id="dueDate"
                    type="date"
                    className={inputStyle}
                    value={taskData.dueDate}
                    onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value.toString().slice(0, 10) })}
                />
            </div>

            {/* Priority */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                    Приоритет
                </Label>
                <Select
                    value={taskData.priority}
                    onValueChange={(value) => setTaskData({ ...taskData, priority: value })}
                >
                    <SelectTrigger className={inputStyle}>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className='!p-2'>
                            {priorities.map((p) => (
                                <SelectItem key={p} value={p} className='!p-2'>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Assignee */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assigneeId" className="text-right">
                    Ответственный
                </Label>
                <Select
                    value={taskData.assigneeId}
                    onValueChange={(value) => setTaskData({ ...taskData, assigneeId: value })}
                >
                    <SelectTrigger className={inputStyle}>
                        <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className='!p-2'>
                            {assignees.map((assigne) => (
                                <SelectItem key={assigne.id} value={assigne.id?.toString() ?? ''} className='!p-2'>
                                    {assigne.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                    Статус
                </Label>
                <Select
                    value={taskData.status}
                    onValueChange={(value) => setTaskData({ ...taskData, status: value })}
                >
                    <SelectTrigger className={inputStyle}>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className='!p-2'>
                            {statuses.map((status) => (
                                <SelectItem key={status.key} value={status.key} className='!p-2'>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={onClick} className='flex w-max !p-2 !ml-auto'>{context}</Button>
        </div>
    );
};