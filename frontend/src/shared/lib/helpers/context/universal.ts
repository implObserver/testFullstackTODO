'use client';
import { Context, createContext, useContext } from 'react';

// Создаем контекст с типом `unknown`
export const UniversalContext: Context<unknown> = createContext<unknown>(undefined);

// Универсальный хук для получения значения, указываешь тип при использовании
export const useUniversalContext = <T,>() => {
    const ctx = useContext(UniversalContext) as T | undefined;
    console.log(UniversalContext)
    if (ctx === undefined) {
        throw new Error('useUniversalContext must be used within its Provider');
    }
    return ctx;
};