import { PublicUser } from "#/services/lib";

export interface UserState {
    isAuthenticated: boolean,
    user?: PublicUser,
}