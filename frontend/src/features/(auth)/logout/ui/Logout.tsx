
import { $rtkApi } from "#/services/lib";
import { useAppDispatch } from "#/services/lib/helpers/hooks/useAppDispatch";
import { useLogoutMutation } from "#/services/models/user";

import { selectUser, UserSliceActions } from "#/services/slices/user";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const Logout = () => {
    const [logout] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const auth = useSelector(selectUser);
    const handleClick = async () => {
        console.log("Выход из системы:");
        try {
            await logout(auth.user).unwrap();
            dispatch(UserSliceActions.logout())
            dispatch($rtkApi.util.resetApiState());
            console.log("Выход из системы выполнен!");
            router.push('/login');
        } catch (error) {
            console.error("Ошибка выхода из системы", error);
        }
    };
    return (
        <div>
            <button onClick={handleClick} className="ml-auto">Выйти</button>
        </div>
    )
}