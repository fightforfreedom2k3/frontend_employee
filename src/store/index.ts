import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employeeReducer from './employeeSlice';
import departmentReducer from './departmentSlice';
import attendanceReducer from './attendanceSlice';
import mealReducer from './mealSlice';
import contractReducer from './contractSlice';
import leaveRequestReducer from './leaveRequestSlice';
import propertyReducer from './propertySlice';
import meetingReducer from './meetingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    department: departmentReducer,
    attendance: attendanceReducer,
    meal: mealReducer,
    contract: contractReducer,
    leaveRequest: leaveRequestReducer,
    property: propertyReducer,
    meeting: meetingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
