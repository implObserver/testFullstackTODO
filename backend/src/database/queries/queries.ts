import { taskQueries } from "./task/task.queries.js";
import { userQueries } from "./user/user.queries.js";

export const prismaDB = {
    ...userQueries,
    ...taskQueries,
};