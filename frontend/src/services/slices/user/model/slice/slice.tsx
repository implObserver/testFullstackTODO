import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./defaultState";
import { UserState } from "../types/user.types";
import { FullUser } from "#/services/lib";




const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: () => {
            return initialState;
        },
        login: (state: UserState, action: PayloadAction<FullUser>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
    },
})

export const UserSliceActions = UserSlice.actions;
export const UserSliceReducer = UserSlice.reducer;