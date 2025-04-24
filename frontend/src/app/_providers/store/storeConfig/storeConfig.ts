'use client';

import { $rtkApi } from '#/services/lib';
import { UserSliceReducer } from '#/services/slices/user';
import { authMiddleware } from '#/services/utils';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Редьюсеры, которые должны быть персистентными
const persistReducers = combineReducers({
	userState: UserSliceReducer,
});

// Конфигурация для персистентного редьюсера
const persistConfig = {
	key: 'root',
	storage,
};

// Персистентный редьюсер
const persistedReducer = persistReducer(persistConfig, persistReducers);

// Корневой редьюсер, объединяющий персистентные и не персистентные редьюсеры
const rootReducer = combineReducers({
	[$rtkApi.reducerPath]: $rtkApi.reducer,
	persisted: persistedReducer,
});

// Создание хранилища
export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat($rtkApi.middleware, authMiddleware),
});

// Персистор для управления персистентным состоянием
export const persistor = persistStore(store);

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;