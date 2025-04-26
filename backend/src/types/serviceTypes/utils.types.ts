import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { PublicUser } from "../user/user.types.js";
import { FullTask } from "../task/task.types.js";

export type PaginationOptions = {
    page?: number;
    limit?: number;
};

export type GroupKey = 'today' | 'thisWeek' | 'future';

export type PrismaError = PrismaClientKnownRequestError | PrismaClientUnknownRequestError | PrismaClientValidationError;

export interface AssigneeGroup {
    assignee: PublicUser,
    tasks: FullTask[]
} 