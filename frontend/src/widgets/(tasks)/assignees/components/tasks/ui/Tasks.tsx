'use client'
import { DeadLineMarker } from "#/entities/deadlineMarker";
import { ItemTable } from "#/entities/itemTable"
import { StatusContainer } from "#/entities/statusContainer";
import { UpdateTask } from "#/features/updateTask";
import { FullTask } from "#/services/lib"
import { heads } from "../lib/const/table";

interface TasksProps {
    tasks: FullTask[],
}

export const Tasks: React.FC<TasksProps> = ({ tasks }) => {
    return (
        <div className="grid !mt-4">
            <ItemTable<FullTask>
                items={tasks}
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

            {tasks.length === 0 && <span className='!p-2'>Нет задач</span>}
        </div>
    )
}