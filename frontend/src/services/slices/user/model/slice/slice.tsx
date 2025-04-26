import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./defaultState";
import { UserState } from "../types/user.types";
import { PublicUser } from "#/services/lib";

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: () => {
            return initialState;
        },
        login: (state: UserState, action: PayloadAction<{ user: Partial<PublicUser> }>) => {
            state.isAuthenticated = true;
            state.user = {
                ...state.user, // сохраняем существующие данные
                firstName: action.payload.user.firstName || '', // значение по умолчанию
            };
        }
    },
})

export const UserSliceActions = UserSlice.actions;
export const UserSliceReducer = UserSlice.reducer;