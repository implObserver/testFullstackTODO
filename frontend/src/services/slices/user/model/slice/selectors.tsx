import { UserState } from "../types/user.types";

export const selectUser = (state: { persisted: { userState: UserState } }) => state.persisted.userState;