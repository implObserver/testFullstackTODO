"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Схема формы
export const registerFormSchema = z.object({
  login: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  firstName: z.string().min(0).max(50).optional(),
  lastName: z.string().min(0).max(50).optional(),
  middleName: z.string().min(0).max(50).optional(),
});

// Типы формы, полученные из схемы
export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Кастомный хук для формы регистрации
export const useRegisterForm = () => {
  return useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      login: "",
      password: "",
      firstName: "",
      lastName: "",
      middleName: "",
    },
  });
};

export const fieldLabels: Record<keyof RegisterFormData, string> = {
  login: "Логин",
  password: "Пароль",
  firstName: "Имя",
  lastName: "Фамилия",
  middleName: "Отчество",
};