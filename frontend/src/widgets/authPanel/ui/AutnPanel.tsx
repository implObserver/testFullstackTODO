'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "#/services/lib";
import { Logout } from "#/features/(auth)/logout";
import { selectUser } from "#/services/slices/user";
import { useSelector } from "react-redux";
import { AvatarDemo } from "#/entities/avatarDemo";

export const AuthPanel = () => {
    const state = useSelector(selectUser);
    const status = state.isAuthenticated;
    console.log(state.user)
    return (
        <div>
            {status
                ? <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="flex items-center gap-2 !mr-6">
                            <AvatarDemo />
                            <span className="cursor-pointer text-2xl">{state.user?.firstName}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="grid !p-2 gap-2 ">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="!p-2">Профиль</DropdownMenuItem>
                        <DropdownMenuItem className="!p-2">
                            <Logout></Logout>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                : <></>
            }
        </div>
    )
}