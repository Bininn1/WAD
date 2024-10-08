// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './Slice';

// ... 기타 설정 ...

export const store = configureStore({
    reducer: {
        canvas: canvasReducer,
        // 다른 리듀서도 있다면 여기에 추가
    },
    devTools: {
        trace: true, // action 디스패치에 대한 스택 트레이스를 포함하려면 true로 설정
    },
});

export type RootState = ReturnType<typeof store.getState>; // RootState 타입 정의
export type AppDispatch = typeof store.dispatch;

export default store;