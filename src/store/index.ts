import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import employeeReducer from './employeeSlice';
import departmentReducer from './departmentSlice';

export const store = configureStore ({
    reducer: {
        auth: authReducer,
        employee: employeeReducer,
        department: departmentReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch