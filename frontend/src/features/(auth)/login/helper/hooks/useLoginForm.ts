"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Схема формы
export const registerFormSchema = z.object({
  login: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

// Типы формы, полученные из схемы
export type LoginFormData = z.infer<typeof registerFormSchema>;

export const useLoginForm = () => {
  return useForm<LoginFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });
};

export const fieldLabels: Record<keyof LoginFormData, string> = {
  login: "Логин",
  password: "Пароль",
};