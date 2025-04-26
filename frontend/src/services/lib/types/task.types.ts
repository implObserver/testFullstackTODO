import { PublicUser } from "./user.types";

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';

export interface PublicTask {
    id: string | number;
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
}

export interface FullTask extends PublicTask {
    createdAt: Date;
    updatedAt: Date;
    creatorId: number;
    assigneeId: number;
}

export interface TaskModalType {
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    assigneeId: string,
    status: string,
}
export interface AssigneeGroup {
    assignee: PublicUser,
    tasks: FullTask[]
} 