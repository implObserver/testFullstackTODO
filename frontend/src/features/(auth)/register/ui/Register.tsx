'use client'
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    ServerError,
} from "#/services/lib";
import { useRegisterMutation } from "#/services/models/user";
import Link from "next/link";
import { fieldLabels, RegisterFormData, useRegisterForm } from "../lib/helper/hooks/useRegisterForm";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "#/services/lib/helpers/hooks/useAppDispatch";
import { selectUser, UserSliceActions } from "#/services/slices/user";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const Register = () => {
    const [registerUser, { isLoading }] = useRegisterMutation();
    const form = useRegisterForm();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user.isAuthenticated) {
            router.push('/tasks')
        }
    })

    const onSubmit = async (data: RegisterFormData) => {
        form.clearErrors("root");

        try {
            const user = await registerUser(data).unwrap();
            dispatch(UserSliceActions.login(user))
            router.push('/tasks')
        } catch (err) {
            const error = err as ServerError;
            const errorMessage = error?.data?.error ?? "Неизвестная ошибка. Попробуйте позже.";

            if (errorMessage.toLowerCase().includes("password")) {
                form.setError("password", { message: errorMessage });
            } else if (errorMessage.toLowerCase().includes("login")) {
                form.setError("login", { message: errorMessage });
            } else {
                form.setError("root", { message: errorMessage });
            }
        }
    };


    const renderFields = () => {
        return (["login", "password", "firstName", "lastName", "middleName"] as (keyof RegisterFormData)[])
            .map((name) => (
                <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{fieldLabels[name]}</FormLabel>
                            <FormControl>
                                <Input
                                    className="!p-2"
                                    type={name === "password" ? "password" : "text"}
                                    placeholder={fieldLabels[name]}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ));
    };

    return (
        <div className="grid gap-4 justify-self-center self-center">
            <p className="text-[30px] ">
                Зарегистрироваться:
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-[400px] space-y-6 gap-2">
                    {renderFields()}
                    <div className="flex !p-2">
                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}
                        <p className="flex text-sm text-blue-500 !ml-auto">
                            <Link href={'/login'}>
                                Уже есть аккаунт?
                            </Link>
                        </p>
                    </div>

                    <Button type="submit" disabled={isLoading} className="!p-2 max-w-[150px]">
                        {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

