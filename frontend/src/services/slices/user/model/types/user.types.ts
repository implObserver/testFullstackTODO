import { FullUser } from "#/services/lib";

export interface UserState {
    isAuthenticated: boolean,
    user?:FullUser,
}