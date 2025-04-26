"use client"

import { z } from "zod"

export const registerFormSchema = z.object({
    login: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    middleName: z.string().min(2).max(50).optional(),
})

