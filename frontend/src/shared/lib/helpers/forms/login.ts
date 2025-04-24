"use client"

import { z } from "zod"

export const loginFormSchema = z.object({
    login: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
})