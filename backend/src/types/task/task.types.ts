export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';

export interface PublicTask {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  creator: string;
  assignee: string;
}

export interface FullTask extends PublicTask {
  createdAt: Date;
  updatedAt: Date;
  creatorId: number;
  assigneeId: number;
}