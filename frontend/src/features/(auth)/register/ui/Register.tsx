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
import { fieldLabels, RegisterFormData, useRegisterForm } from "../lib/helper/hooks/useRegisterForm";

export const Register = () => {
    const [registerUser, { isLoading }] = useRegisterMutation();
    const form = useRegisterForm();

    const onSubmit = async (data: RegisterFormData) => {
        form.clearErrors("root");

        try {
            await registerUser(data).unwrap();
        } catch (err) {
            const error = err as ServerError;
            const errorMessage = error?.data?.error ?? "Неизвестная ошибка. Попробуйте позже.";
            console.log('dwdw')
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderFields()}
                {form.formState.errors.root && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.root.message}
                    </p>
                )}
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
                </Button>
            </form>
        </Form>
    );
};

