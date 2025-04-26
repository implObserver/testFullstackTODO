'use client';

import { Middleware } from '@reduxjs/toolkit';
import { isRejected } from '@reduxjs/toolkit';
import { UserSliceActions } from '#/services/slices/user';

// Определите тип для ошибки
type ApiError = {
    status?: number;
};

// Определите тип для отклоненного действия
type RejectedAction = {
    type: string;
    payload?: {
        status: number,
        error: ApiError;
    };
};

export const authMiddleware: Middleware<unknown, unknown> = (store) => (next) => async (action: unknown) => {
    // Проверяем, что действие является объектом и содержит свойство `type`
    if (
        typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        typeof (action as { type: string }).type === 'string'
    ) {
        const typedAction = action as RejectedAction;
        // Проверяем, является ли действие отклоненным
        if (isRejected(typedAction)) {
            const errorStatus = typedAction.payload?.status;
            if (errorStatus === 401) {
                store.dispatch(UserSliceActions.logout());
            }
        }
    }

    return next(action);
};